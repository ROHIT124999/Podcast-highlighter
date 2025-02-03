// import React, { useState } from "react";
// import FileUpload from "./components/FileUpload";
// import TranscriptView from "./components/TranscriptView";
// import QueryForm from "./components/QueryForm";

// function App() {
//   const [transcript, setTranscript] = useState("");
//   const [summary, setSummary] = useState("");
//   const [context, setContext] = useState([]);
//   const [answer, setAnswer] = useState("");

//   const handleUpload = (data) => {
//     setTranscript(data.transcript);
//     setSummary(data.success || "Transcript processed successfully!");
//   };

//   const handleQuery = (response) => {
//     setAnswer(response.answer);
//     setContext(response.context || []);
//   };

//   return (
//     <>
//     <div className="app">
//       <h1>Podcast Highlighter</h1>
//       <FileUpload onUpload={handleUpload} />
//       {transcript && (
//         <TranscriptView transcript={transcript} summary={summary} />
//       )}
//       {transcript && (
//         <QueryForm onQuery={handleQuery} />
//       )}
//       {answer && (
//         <div className="query-response">
//           <h3>Answer:</h3>
//           <p>{answer}</p>
//           {context.length > 0 && (
//             <div>
//               <h4>Context:</h4>
//               <ul>
//                 {context.map((ctx, idx) => (
//                   <li key={idx}>{ctx}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//     </>
//   );
// }

// ############################PArt 2 Code#####################################
// export default App;
import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import TranscriptView from "./components/TranscriptView";
import QueryForm from "./components/QueryForm";
import { Card } from "./components/card"; // Update paths based on your file structure
import { Button } from "./components/button";
import { motion } from "framer-motion";


function App() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [context, setContext] = useState([]);
  const [answer, setAnswer] = useState("");

  const handleUpload = (data) => {
    setTranscript(data.transcript);
    setSummary(data.success || "Transcript processed successfully!");
  };

  const handleQuery = (response) => {
    setAnswer(response.answer);
    setContext(response.context || []);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Podcast Highlighter 🎙️
        </h1>
        <p className="text-gray-600 text-lg">
          Transcribe, summarize, and query your favorite podcasts in seconds!
        </p>
      </motion.div>

      <Card className="p-6 max-w-4xl w-full shadow-lg bg-white">
        <FileUpload onUpload={handleUpload} />

        {transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TranscriptView transcript={transcript} summary={summary} />
            <QueryForm onQuery={handleQuery} />
          </motion.div>
        )}

        {answer && (
          <motion.div
            className="query-response bg-gray-50 mt-6 p-4 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Answer:
            </h3>
            <p className="text-gray-800 mb-4">{answer}</p>
            {context.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-600">Context:</h4>
                <ul className="list-disc pl-6">
                  {context.map((ctx, idx) => (
                    <li key={idx} className="text-gray-700">{ctx}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </div>
  );
}

export default App;
