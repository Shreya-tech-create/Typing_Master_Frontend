import React, { useEffect, useRef, useState, useContext } from "react";
import "../styles/TakeTest.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import apis from "../apis";

const colors = [
  "#FF6B6B","#6BCB77","#4D96FF","#FFD93D","#FF6F91",
  "#845EC2","#00C9A7","#FF9671","#FFC75F","#F9F871",
];

const TakeTest = () => {
  const { user } = useContext(AuthContext);
  const [paragraph, setParagraph] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);
  const inputRef   = useRef(null);
  const timerRef   = useRef(null);

  /* fetch paragraph */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(apis.TEST);
        setParagraph(data.content);
      } catch (err) {
        console.error("Failed to fetch paragraph", err);
        setParagraph("Failed to fetch paragraph from backend.");
      }
    })();
    inputRef.current.focus();
  }, []);

  /* timer */
  useEffect(() => {
    if (startTime && !testCompleted) {
      timerRef.current = setInterval(() => {
        setTimeTaken(((Date.now() - startTime) / 1000).toFixed(2));
      }, 100);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [startTime, testCompleted]);

  /* helpers */
  const calculateSpeed = () => {
    if (!timeTaken) return 0;
    const words = userInput.trim().split(" ").filter(Boolean).length;
    return Math.round(words / (timeTaken / 60));
  };
  const calculateAccuracy = () => {
    const total = userInput.length;
    let correct = 0;
    for (let i = 0; i < total; i++) if (userInput[i] === paragraph[i]) correct++;
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  };

  /* send score */
  const submitScoreToBackend = async () => {
    if (!user?._id) return console.error("❌ User ID missing.");
    try {
      await axios.post(
        "http://localhost:5000/api/score",
        {
          user: user._id,
          speed: calculateSpeed(),
          accuracy: calculateAccuracy(),
          timeTaken: parseFloat(timeTaken),
          errorCount: errors,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Error submitting score:", err.response?.data || err.message);
    }
  };

  /* handlers */
  const handleChange = (e) => {
    if (testCompleted) return;
    const value = e.target.value;
    setUserInput(value);
    if (!startTime && value.length) setStartTime(Date.now());
    let errCnt = 0;
    for (let i = 0; i < value.length; i++) if (value[i] !== paragraph[i]) errCnt++;
    setErrors(errCnt);
  };

  const handleKeyDown = (e) => {
    const key = e.key.toUpperCase();
    if ("QWERTYUIOPASDFGHJKLZXCVBNM".includes(key)) setPressedKey(key);
    if (e.key === "Enter" && !testCompleted && userInput.length) {
      e.preventDefault();
      clearInterval(timerRef.current);
      setTestCompleted(true);
      setFinalTime(timeTaken);
      submitScoreToBackend();
    }
  };
  const handleKeyUp = () => setPressedKey(null);
  const getKeyColor = (key) =>
    pressedKey === key ? colors[key.charCodeAt(0) % colors.length] : "#eee";

  const renderParagraph = () =>
    paragraph.split("").map((char, i) => (
      <span
        key={i}
        className={
          i < userInput.length
            ? char === userInput[i]
              ? "correct"
              : "incorrect"
            : ""
        }
      >
        {char}
      </span>
    ));

  const resetTest = () => {
    setUserInput("");
    setStartTime(null);
    setTimeTaken(0);
    setFinalTime(null);
    setErrors(0);
    setTestCompleted(false);
    setPressedKey(null);
    inputRef.current.focus();
  };

  /* ---------- UI ---------- */
  return (
    <div
      className="test-wrapper"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <h2 className="test-title">🧠 Take Your Typing Test</h2>

      <div className="typing-area">
        {/* ✅ NEW container with fixed width */}
        <div className="test-paragraph-container">      {/* ✅ added */}
          <div className="paragraph-box">{renderParagraph()}</div>
        </div>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleChange}
          className="hidden-textarea"
          placeholder="Start typing here..."
          disabled={testCompleted}
        />
      </div>

      {/* Mechanical Keyboard */}
      <div className="keyboard1">
        <div className="keyboard-row1">
          {"QWERTYUIOP".split("").map((key) => (
            <div key={key} className="key1" style={{ backgroundColor: getKeyColor(key) }}>
              {key}
            </div>
          ))}
        </div>
        <div className="keyboard-row1">
          {"ASDFGHJKL".split("").map((key) => (
            <div key={key} className="key1" style={{ backgroundColor: getKeyColor(key) }}>
              {key}
            </div>
          ))}
        </div>
        <div className="keyboard-row1">
          {"ZXCVBNM".split("").map((key) => (
            <div key={key} className="key1" style={{ backgroundColor: getKeyColor(key) }}>
              {key}
            </div>
          ))}
        </div>
      </div>

      <div className="stats">
        <p>⏱ Time: {finalTime ? `${finalTime}s` : startTime ? "Typing..." : "0s"}</p>
        <p>❌ Errors: {errors}</p>
        <p>⚡ Speed: {calculateSpeed()} WPM</p>
        <p>✅ Accuracy: {calculateAccuracy()}%</p>
      </div>

      <button className="reset-btn" onClick={resetTest}>🔄 Reset Test</button>
    </div>
  );
};

export default TakeTest;
