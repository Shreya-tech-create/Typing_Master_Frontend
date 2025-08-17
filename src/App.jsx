import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";

/* ⬇️  PAGES */
import Navbar from "./pages/navbar";            // ✅ UPDATED - path/file-name case fixed
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TakeTest from "./pages/TakeTest";
import Leaderboard from "./pages/Leaderboard";
import AddTest from "./pages/AddTest";
import FallingWordsGame from "./pages/FallingWordsGame";
import Challenge from "./pages/Challenge";
import ContactUs from "./pages/ContactUs";
import AdminDashboard from "./pages/AdminDashboard"; 

/* ⬇️  COMPONENT */
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* 🏠 Public */}
          <Route path="/"       element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login"  element={<Login />}  />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/admin"  element={<AdminDashboard />} />

          {/* 🔒 Private */}
          <Route
            path="/test"
            element={
              <PrivateRoute>
                <TakeTest />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-test"
            element={
              <PrivateRoute>
                <AddTest />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenge"
            element={
              <PrivateRoute>
                <Challenge />
              </PrivateRoute>
            }
          />
          <Route
            path="/game"
            element={
              <PrivateRoute>
                <FallingWordsGame />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
