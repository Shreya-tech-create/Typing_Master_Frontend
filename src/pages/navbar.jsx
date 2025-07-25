import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ---------- STATE ----------
  const [placeholder, setPlaceholder] = useState("Search");
  const [index, setIndex] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [score, setScore] = useState(null);
  const dashboardRef = useRef();

  // ---------- rotating placeholder ----------
  const phrases = ["leaderboard", "challenges", "take test", "accuracy", "typing speed"];
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholder(`Search: ${phrases[index]}`);
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(id);
  }, [index]);

  // ---------- latest score ----------
  useEffect(() => {
    (async () => {
      try {
        if (user?._id) {
          const { data } = await axios.get(`http://localhost:5000/api/score/user/${user._id}`);
          if (data.length) setScore(data.at(-1));
        }
      } catch (err) {
        console.error("Error fetching score:", err);
      }
    })();
  }, [user]);

  // ---------- close dashboard on outer click ----------
  useEffect(() => {
    const close = (e) => {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target)) {
        setShowDashboard(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* -------- logo -------- */}
      <div className="navbar-logo">
        <img
          src="https://cdn-icons-png.flaticon.com/64/14026/14026873.png"
          alt="logo"
          className="navbar-icon"
        />
        <span className="logo-title-text">TypingPro</span>
      </div>

      {/* -------- search -------- */}
      <div className="navbar-search">
        <input type="text" placeholder={placeholder} />
      </div>

      {/* -------- links -------- */}
      <div className="navbar-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>                             {/* ✅ Home now points to LandingPage */}

        {user ? (
          <>
            <NavLink to="/test" className="nav-link">
              Take&nbsp;Test
            </NavLink>                          {/* ✅ Test page at /test */}
            <NavLink to="/leaderboard" className="nav-link">
              Leaderboard
            </NavLink>
            {/* <NavLink to="/game" className="nav-link">Game</NavLink> */} {/* ➕ If you want menu link */}

            {/* ---- Dashboard dropdown ---- */}
            <div className="dashboard-wrapper" ref={dashboardRef}>
              <span className="nav-link" onClick={() => setShowDashboard(!showDashboard)}>
                Dashboard
              </span>

              {showDashboard && (
                <div className="dashboard-popup">
                  <p>
                    <strong>Name:</strong> {user.name || user.username || "Anonymous"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  {score ? (
                    <>
                      <p>
                        <strong>Speed:</strong> {score.speed} WPM
                      </p>
                      <p>
                        <strong>Accuracy:</strong> {score.accuracy}%
                      </p>
                    </>
                  ) : (
                    <p>No test given yet</p>
                  )}
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/signup" className="nav-link">
              Signup
            </NavLink>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
