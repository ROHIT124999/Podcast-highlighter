# Podcast-highlighterPodcast Highlighter 🎙️
A web application that transcribes, summarizes, and answers queries based on podcast audio files using advanced AI technologies.

Features 🚀
Audio Transcription: Convert audio podcasts into readable text using Whisper AI.
Smart Summarization: Automatically generate concise summaries of transcripts.
Interactive Query System: Ask questions and get accurate, context-based answers.
Modern UI: Clean, responsive, and interactive interface with Tailwind CSS and Framer Motion.
Tech Stack 💻
Frontend: React.js, Tailwind CSS, Framer Motion
Backend: Flask
AI Models: Whisper for transcription, LangChain & Groq for AI processing
Database: FAISS for vector embeddings
APIs: Google Generative AI Embeddings
Getting Started 🛠️
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/podcast-highlighter.git
cd podcast-highlighter
2. Install Dependencies
Backend
Navigate to the backend folder and install dependencies:

bash
Copy
Edit
cd backend
pip install -r requirements.txt
Frontend
Navigate to the frontend folder and install dependencies:

bash
Copy
Edit
cd frontend
npm install
3. Configure Environment Variables
Create a .env file in the backend directory and set the following keys:

env
Copy
Edit
GROQ_API_KEY=your-groq-api-key
GOOGLE_API_KEY=your-google-api-key
Running the Application 🎮
1. Start the Backend
bash
Copy
Edit
cd backend
python app.py
2. Start the Frontend
bash
Copy
Edit
cd frontend
npm start
The application will be available at http://localhost:3000.