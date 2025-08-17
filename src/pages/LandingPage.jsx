import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/LandingPage.css";
import typeImage from "./../images/type4.avif";
import feature1 from "./../images/game3.jpg";
import feature2 from "./../images/type6.jpg";
import feature3 from "./../images/type5.webp";
import gifImage from "./../images/comgif1.gif";

const KEYBOARD_KEYS = [
  "Q","W","E","R","T","Y","U","I","O","P",
  "A","S","D","F","G","H","J","K","L",
  "Z","X","C","V","B","N","M"
];

const faqData = [
  { question:"What is Typing Pro?", answer:"It is a platform to test, improve, and track your typing speed and accuracy in real‑time." },
  { question:"Is Typing Pro free to use?", answer:"Yes! It is completely free for all users with optional advanced features." },
  { question:"How do I track my progress?", answer:"You can track your typing speed, accuracy, and improvements from your dashboard after login." },
  { question:"Can I see my rank?", answer:"Yes! Check out our leaderboard to see where you stand among other users." }
];

const LandingPage = () => {
  const [activeKeyIndex, setActiveKeyIndex] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      setActiveKeyIndex((idx) => (idx + 1) % KEYBOARD_KEYS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="landing">
      {/* === Hero Section === */}
      <div className="hero-section-wrapper">
        <div className="hero-section">
          <h1>Welcome to Typing Pro</h1>
          <p>Test and improve your typing speed with ease!</p>

          <div className="keyboard">
            {[["Q","W","E","R","T","Y","U","I","O","P"],
              ["A","S","D","F","G","H","J","K","L"],
              ["Z","X","C","V","B","N","M"]].map((row, rowIdx) => (
              <div className="keyboard-row" key={rowIdx}>
                {row.map((key) => {
                  const flatIdx = KEYBOARD_KEYS.indexOf(key);
                  return (
                    <span
                      key={key}
                      className={"keyboard-key" + (flatIdx === activeKeyIndex ? " animated" : "")}
                    >
                      {key}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <button onClick={() => navigate("/signup")}>Get Started</button>
        </div>
      </div>

      {/* === Features Section === */}
      <div className="features-section-wrapper">
        <div className="features-section">
          <h2>Features</h2>
          <div className="features">
            {/* Hard Challenge */}
            <div
              className="feature"
              onClick={() => navigate("/game")}
              style={{ cursor:"pointer" }}
            >
              <img src={feature1} alt="Hard" className="feature-img" />
              <h3>Falling-Word</h3>
              <p>Make your learning more playfull and joyfull.</p>
            </div>

            {/* Medium Challenge */}
            <div
              className="feature"
              onClick={() => navigate("/challenge")}
              style={{ cursor:"pointer" }}
            >
              <img src={feature2} alt="Medium" className="feature-img" />
              <h3>Challenge</h3>
              <p>Three-level challenges inside Take the challenge to improve your typing.</p>
            </div>

            {/* Easy Challenge → leaderboard */}
            <div
              className="feature"
              onClick={() => navigate("/leaderboard")}
              style={{ cursor:"pointer" }}
            >
              <img src={feature3} alt="Easy" className="feature-img" />
              <h3>Leaderboard</h3>
              <p>find your position in typing pro-world</p>
            </div>
          </div>
        </div>
      </div>

      {/* === Quote Section === */}
      <div className="f1-wrapper">
        <div className="f1">
          <div className="f1-left">
            <h1 className="typing-animation">“Typing fast, feeling faster”</h1>
            <p>Join thousands of users improving their typing skills daily with Typing Pro.</p>
            <button onClick={() => navigate(localStorage.getItem("token") ? "/test" : "/login")}>
              Take-Test
            </button>
          </div>
          <div className="f1-right">
            <img src={typeImage} alt="Success Illustration" />
          </div>
        </div>
      </div>

      {/* === FAQ + GIF Section === */}
      <div className="landing-faq-gif-wrapper">
        <div className="faq-gif-container">
          <div className="faq-section">
            <h1 className="faq-heading">Frequently Asked Questions</h1>
            {faqData.map((item, idx) => (
              <div key={idx} className={`faq-item ${openFAQ === idx ? "active" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                >
                  {item.question}
                </button>
                <div className={`faq-answer ${openFAQ === idx ? "show" : ""}`}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          <div className="gif-wrapper">
            <img src={gifImage} alt="Typing Animation" className="landing-gif-large" />
          </div>
        </div>
      </div>

      {/* === Footer === */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-col about">
            <h2>Typing Pro</h2>
            <p>Your one-stop platform to practice, improve, and master your typing skills.</p>
          </div>

          <div className="footer-col links">
            <h3>Quick Links</h3>
            <ul>
              <li onClick={() => navigate("/")}             style={{ cursor:"pointer" }}>Home</li>
              <li onClick={() => navigate("/leaderboard")}  style={{ cursor:"pointer" }}>Leaderboard</li>
              <li onClick={() => navigate("/test")}         style={{ cursor:"pointer" }}>Typing Test</li>
              <li onClick={() => navigate("/login")}        style={{ cursor:"pointer" }}>Login</li>
            </ul>
          </div>

          <div className="footer-col contact">
            <h3 onClick={() => navigate("/contactus")} style={{ cursor:"pointer" }}>
              Contact
            </h3>
            <ul>
              <li>Email: support@typingpro.com</li>
              <li>Phone: +91 98765 43210</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} Typing Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
