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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dashboardRef = useRef();
  const mobileMenuRef = useRef();

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

      {/* -------- search (hidden on mobile) -------- */}
      <div className="navbar-search">
        <input type="text" placeholder={placeholder} />
      </div>

      {/* -------- desktop links -------- */}
      <div className="navbar-links desktop-links">
        <NavLink to="/" className="nav-link" onClick={closeMobileMenu}>
          Home
        </NavLink>

        {user ? (
          <>
            <NavLink to="/test" className="nav-link" onClick={closeMobileMenu}>
              Take&nbsp;Test
            </NavLink>
            <NavLink to="/leaderboard" className="nav-link" onClick={closeMobileMenu}>
              Leaderboard
            </NavLink>

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
            <NavLink to="/signup" className="nav-link" onClick={closeMobileMenu}>
              Signup
            </NavLink>
            <NavLink to="/login" className="nav-link" onClick={closeMobileMenu}>
              Login
            </NavLink>
          </>
        )}
      </div>

      {/* -------- mobile menu button -------- */}
      <div className="mobile-menu-button" onClick={toggleMobileMenu}>
        <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* -------- mobile menu -------- */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <div className="mobile-search">
          <input type="text" placeholder={placeholder} />
        </div>
        
        <div className="mobile-links">
          <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/test" className="mobile-nav-link" onClick={closeMobileMenu}>
                Take Test
              </NavLink>
              <NavLink to="/leaderboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                Leaderboard
              </NavLink>
              
              <div className="mobile-dashboard">
                <div className="mobile-dashboard-header">
                  <strong>Dashboard</strong>
                </div>
                <div className="mobile-dashboard-content">
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
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/signup" className="mobile-nav-link" onClick={closeMobileMenu}>
                Signup
              </NavLink>
              <NavLink to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
