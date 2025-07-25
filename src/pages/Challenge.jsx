// ✅ Challenge.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Challenge.css";
import easyImg from "./../images/white1.jpg";
import mediumImg from "./../images/white3.jpg";
import hardImg from "./../images/type4.avif";

const PARAGRAPHS = {
  easy: "The quick brown fox jumps over the lazy dog.",
  medium: "Typing skills improve with regular practice and a patient mindset.",
  hard:
    "Consistent, deliberate practice is the secret ingredient that turns average efforts into extraordinary achievements.",
};

const ONE_MINUTE = 60;
const normalize = (str) => str.replace(/\s+/g, " ").trim();

const Challenge = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState("menu");
  const [level, setLevel] = useState(null);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(ONE_MINUTE);
  const [popupMsg, setPopupMsg] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef(null);
  const inputRef = useRef("");

  const startTest = (lvl) => {
    setLevel(lvl);
    setStage("test");
    setInput("");
    inputRef.current = "";
    setTimeLeft(ONE_MINUTE);
    setIsFinished(false);
  };

  const finishTest = (success) => {
    if (isFinished) return;
    setIsFinished(true);
    clearInterval(timerRef.current);
    setPopupMsg(success ? "Shabash! Challenge complete 🎉" : "Time up! Try again ☹️");
    setStage("done");
  };

  const resetAll = () => {
    setStage("menu");
    setLevel(null);
    setInput("");
    inputRef.current = "";
    setTimeLeft(ONE_MINUTE);
    setIsFinished(false);
  };

  useEffect(() => {
    if (stage !== "test") return;
    timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [stage]);

  useEffect(() => {
    if (stage === "test" && timeLeft <= 0) {
      const para = level ? PARAGRAPHS[level] : "";
      const success = normalize(inputRef.current) === normalize(para);
      finishTest(success);
    }
  }, [timeLeft, stage, level]);

  const paragraph = level ? PARAGRAPHS[level] : "";

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    inputRef.current = val;
    if (normalize(val) === normalize(paragraph)) finishTest(true);
  };

  return (
    <div className="challenge-container">
      {stage === "menu" && (
        <div className="difficulty-cards">
          <h2>Choose Your Challenge</h2>
          <div className="card-row">
            <div className="diff-card easy" onClick={() => startTest("easy")}> <img src={easyImg} alt="easy" className="card-img" /> Easy </div>
            <div className="diff-card medium" onClick={() => startTest("medium")}> <img src={mediumImg} alt="medium" className="card-img" /> Medium </div>
            <div className="diff-card hard" onClick={() => startTest("hard")}> <img src={hardImg} alt="hard" className="card-img" /> Hard </div>
          </div>
        </div>
      )}

      {stage === "test" && (
        <div className="typing-area">
          <h3>{level?.toUpperCase()} Challenge</h3>
          <p className="paragraph">{paragraph}</p>
          <textarea
            value={input}
            onChange={handleChange}
            placeholder="Start typing here..."
            rows={4}
            autoFocus
          />
          <p className="timer">Time Left: {timeLeft}s</p>
          <button className="back-btn" onClick={resetAll}>Back to Challenges</button>
        </div>
      )}

      {stage === "done" && (
        <div className="challenge-popup">
          <h3>{popupMsg}</h3>
          <button type="button" onClick={resetAll}>Back to Challenges</button>
          <button type="button" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      )}
    </div>
  );
};

export default Challenge;
