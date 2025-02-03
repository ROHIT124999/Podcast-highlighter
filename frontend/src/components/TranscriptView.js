import React from "react";

function TranscriptView({ transcript, summary }) {
  return (
    <div className="transcript-view">
      <h3>Transcript:</h3>
      <p>{transcript}</p>
      <h3>Summary:</h3>
      <p>{summary}</p>
    </div>
  );
}

export default TranscriptView;
