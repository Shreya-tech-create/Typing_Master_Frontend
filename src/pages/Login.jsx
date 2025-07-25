import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import loginImg from "../images/type10.avif";
import "../styles/Login.css";
import apis from "../apis";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", isAdmin: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: Backend login route does NOT expect isAdmin from frontend, so no problem sending it
      const res = await axios.post(apis.LOGIN, {
        email: formData.email,
        password: formData.password,
      });
      login(res.data.user, res.data.token);
      navigate("/test");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-image">
          <img src={loginImg} alt="login" />
        </div>
        <form className="login-form bounce" onSubmit={handleSubmit} autoComplete="off">
          <h2>Let’s Get Started</h2>

          <div className="google-btn">
            <i className="fab fa-google"></i>
            <span>Sign in with Google</span>
          </div>

          <div className="or-separator">
            <span className="line"></span>
            <span className="or-text">OR</span>
            <span className="line"></span>
          </div>

          <div className="login-floating-label">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <label>Email</label>
          </div>

          <div className="login-floating-label">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <label>Password</label>
          </div>

          {/* New checkbox for isAdmin */}
          <div className="login-checkbox-wrapper">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            <label htmlFor="isAdmin">Login as Admin</label>
          </div>

          <button type="submit" className="login-button">Login</button>

          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
