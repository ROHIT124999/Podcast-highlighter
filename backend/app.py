from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from whisper import load_model
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

load_dotenv()

# API keys
groq_api_key = os.getenv('GROQ_API_KEY')
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Initialize models
llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")
whisper_model = load_model("base")

# Prompt template for Groq
prompt = ChatPromptTemplate.from_template(
    """
    First highlight the main topics spoken about in the given podcast and then Answer the questions based on the provided podcast transcript context only. 
    Please provide the most accurate and concise response. in the following format.
    <Highlights>
    <context>
    {context}
    </context>
    Question: {input}
    """
)

vector_store = None

# Allowed file types
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Generate vector embeddings from the transcript
def vector_embedding(transcript):
    global vector_store
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    # Split the transcript into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(transcript)
    
    if not chunks:
        return {"error": "No valid chunks were created from the transcript."}
    
    try:
        vector_store = FAISS.from_texts(chunks, embeddings)
        return {"success": "Vector Store DB Is Ready"}
    except Exception as e:
        return {"error": f"An error occurred while creating the vector store: {str(e)}"}

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Upload an audio file, transcribe it, and create a vector store from the transcript.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:


            # Step 1: Transcribe the audio

            print("Starting transcription...")

            transcript = whisper_model.transcribe(file_path)["text"]

            if not transcript.strip():

                os.remove(file_path)
                print("Error: Transcription failed. File might be silent or invalid.")
                return jsonify({"error": "Transcription failed. The audio file might be silent or invalid."}), 400



            print("Transcript generated successfully!")

            # Step 2: Create the vector store
            print("Creating vector store...")
            result = vector_embedding(transcript)
            os.remove(file_path)  # Remove the audio file after processing

            if "error" in result:
                print(f"Error in vector store creation: {result['error']}")
                return jsonify(result), 500

            result["transcript"] = transcript  # Include the transcript in the response
            print("Vector store created successfully!")
            return jsonify(result)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "File type not allowed"}), 400


@app.route('/query', methods=['POST'])
def query_documents():
    """
    Answer a user question based on the podcast transcript.
    """
    global vector_store
    data = request.json
    question = data.get('question')
    
    if not question or vector_store is None:
        return jsonify({"error": "Missing question or vector store not ready"}), 400
    
    try:
        # Create the retrieval chain
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = vector_store.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        
        # Get the response from Groq Llama 3
        response = retrieval_chain.invoke({'input': question})
        
        return jsonify({
            "answer": response['answer'],
            "context": [doc.page_content for doc in response["context"]]
        })

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)
