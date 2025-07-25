import React, { useState } from "react";
import "./../styles/ContactUs.css";

const ContactUs = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan tum backend call kar sakti ho ya simple alert de sakti ho
    setSubmitted(true);
  };

  return (
    <div className="contact-form-overlay">
      <div className="contact-form-container">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Contact Us</h2>
        {submitted ? (
          <p className="thankyou-msg">Thank you for contacting us! We'll get back soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            
            <label>Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required />
            
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
