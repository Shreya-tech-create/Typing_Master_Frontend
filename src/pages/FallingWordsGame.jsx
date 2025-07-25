import React, { useEffect, useState, useRef } from "react";
import "../styles/FallingWordsGame.css";

const WORDS = [
  "hello","world","react","typing","speed",
  "challenge","keyboard","game","fast","code"
];
const GAME_DURATION = 60;
const getRandomInt = (max) => Math.floor(Math.random() * max);

const FallingWordsGame = () => {
  const [fallingWord, setFallingWord] = useState("");
  const [top, setTop] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);

  /* refs */
  const animationRef = useRef(null);
  const speedRef = useRef(1);
  const letterIndexRef = useRef(0);
  const gameAreaRef   = useRef(null);   // 👈 जहाँ शब्द गिरेंगे

  /* ---------- helpers ---------- */
  const resetWord = () => {
    setFallingWord(WORDS[getRandomInt(WORDS.length)]);
    letterIndexRef.current = 0;
    setTop(0);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    resetWord();
  };

  /* ---------- timer ---------- */
  useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      cancelAnimationFrame(animationRef.current);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver]);

  /* ---------- start new word on game restart ---------- */
  useEffect(() => {
    if (!gameOver) resetWord();
  }, [gameOver]);

  /* ---------- falling animation ---------- */
  useEffect(() => {
    if (gameOver) return;

    const fall = () => {
      setTop((prev) => {
        const limit = gameAreaRef.current
          ? gameAreaRef.current.offsetHeight - 60 // 60px safety
          : window.innerHeight;
        if (prev > limit) {
          resetWord();
          return 0;
        }
        return prev + speedRef.current;
      });
      animationRef.current = requestAnimationFrame(fall);
    };

    animationRef.current = requestAnimationFrame(fall);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameOver]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver || !fallingWord) return;
      const key = e.key.toLowerCase();
      if (key === fallingWord[letterIndexRef.current]) {
        letterIndexRef.current += 1;
        if (letterIndexRef.current === fallingWord.length) {
          setScore((s) => s + 1);
          resetWord();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [fallingWord, gameOver]);

  /* ---------- UI ---------- */
  const renderWord = () =>
    fallingWord.split("").map((c, i) => (
      <span key={i} className={i < letterIndexRef.current ? "letter correct" : "letter"}>
        {c}
      </span>
    ));

  return (
    <div className="falling-container">
      {/* Heading + Timer */}
      <div className="heading-timer-block">
        <h1>Falling Words Game</h1>
        <p>Time Left: {timeLeft}s &nbsp;|&nbsp; Score: {score}</p>
      </div>

      {/* 👇 यहीं से शब्द गिरेंगे */}
      <div className="game-area" ref={gameAreaRef}>
        {!gameOver && (
          <div
            className="falling-word"
            style={{ top: `${top}px`, left: "50%", transform: "translateX(-50%)" }}
          >
            {renderWord()}
          </div>
        )}
      </div>

      {/* Game-over popup */}
      {gameOver && (
        <div className="game-over-popup">
          <h3>🎉 Game Over!</h3>
          <p className="wow-text">Wow! You completed the game! 🎊</p>
          <p>Your Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default FallingWordsGame;
