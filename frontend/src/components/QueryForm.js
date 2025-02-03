import React, { useState } from "react";
import axios from "axios";

function QueryForm({ onQuery }) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  const handleQuery = async () => {
    if (!question) {
      setError("Please enter a question before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000"}/query`,
        { question },
        { headers: { "Content-Type": "application/json" } }
      );
      onQuery(response.data);
      setQuestion("");
    } catch (error) {
      setError("Failed to fetch answer. Please try again.");
    }
  };

  return (
    <div className="query-form">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the transcript"
      />
      <button onClick={handleQuery}>Submit</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default QueryForm;
