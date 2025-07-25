
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import signupImg from "../images/keyboard2.jpg";
import "../styles/Signup.css";
import apis from "../apis";
const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(apis.SIGNUP, formData);
      alert(res.data.message || "Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-main">
        <img src={signupImg} alt="signup illustration" />
        <div className="signup-form-container">
          <form
            className="signup-form bounce"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <h2>Create an Account</h2>

            <div className="signup-input-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder=" "
                autoComplete="off"
              />
              <label>Username</label>
            </div>

            <div className="signup-input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
                autoComplete="off"
              />
              <label>Email</label>
            </div>

            <div className="signup-input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
                autoComplete="new-password"
              />
              <label>Password</label>
            </div>

            {/* Admin checkbox removed */}

            <button type="submit" className="signup-btn">Signup</button>

            <div className="signup-login-link">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
