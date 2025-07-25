import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/AddTest.css";
import apis from "../apis";

const AddTest = () => {
  const { token } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token being sent:", token); 
    if (!content.trim()) {
      setMessage("Please enter some text");
      return;
    }

    try {
      const res = await axios.post(
        apis.TEST,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      setMessage(res.data.message || "Paragraph added successfully");
      setContent("");
    } catch (error) {
      console.error("❌ Add para error:", error);
      setMessage(error.response?.data?.message || "Failed to add paragraph");
    }
  };

  return (
    <div className="add-test-container">
      <h2>Add Your Own Typing Test Paragraph</h2>
      <form onSubmit={handleSubmit} className="add-test-form">
        <textarea
          rows="6"
          placeholder="Type or paste your paragraph here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="add-test-textarea"
        />
        <button type="submit" className="add-test-btn">Add Paragraph</button>
      </form>
      {message && <p className="add-test-message">{message}</p>}
    </div>
  );
};

export default AddTest;
