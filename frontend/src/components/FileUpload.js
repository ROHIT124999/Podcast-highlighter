import React, { useState } from "react";
import axios from "axios";

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000"}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onUpload(response.data);
      setFile(null);
    } catch (error) {
      setError("Failed to upload file. Please try again.");
    }
  };

  return (
    <div className="file-upload">
      <input type="file" accept=".mp3,.wav,.m4a" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default FileUpload;
