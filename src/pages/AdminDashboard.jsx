import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

// ✅ Image imports
import leaderboardIcon from "../images/leaderboard-icon.png";
import addParaIcon from "../images/addpara-icon.png";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>

      <div className="admin-card-row">
        <div className="admin-card leaderboard-card" onClick={() => navigate("/leaderboard")}>
          <img
            src={leaderboardIcon}
            alt="Leaderboard"
            className="admin-card-img"
          />
          <p>Show Leaderboard</p>
        </div>

        <div className="admin-card addpara-card" onClick={() => navigate("/add-test")}>
          <img
            src={addParaIcon}
            alt="Add Paragraph"
            className="admin-card-img"
          />
          <p>Add Paragraph</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
