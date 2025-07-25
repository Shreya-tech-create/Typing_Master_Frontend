import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Leaderboard.css";
import apis from "../apis";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get(apis.SCORES);
        setScores(res.data);
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="leaderboard-wrapper">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>
      <div className="leaderboard-table-container">
        {scores.length === 0 ? (
          <p className="error">No scores yet.</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Speed (WPM)</th>
                <th>Accuracy (%)</th>
                <th>Errors</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score._id} className={index < 3 ? "top-three" : ""}>
                  <td className="rank-icon">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>
                  <td>{score.user?.username || "Unknown"}</td>
                  <td>{score.speed}</td>
                  <td>{score.accuracy}</td>
                  <td>{score.errorCount}</td>
                  <td>{new Date(score.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
