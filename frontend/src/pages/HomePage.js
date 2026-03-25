import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

import complaintImg from "../assets/complaint.png";
import permissionImg from "../assets/permission.png";
import dashboardImg from "../assets/dashboard.png";
import letterImg from "../assets/telegram.png";

const floatingIcons = ["📚", "💡", "⚡", "📱", "📝", "🎓", "📊", "🌐"];

const HomePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  // ✅ On page load, fetch logged-in user
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); // ✅ store user in App.js state
      } catch (err) {
        console.error("Error fetching logged-in user", err);
        localStorage.removeItem("token");
      }
    };

    fetchLoggedInUser();
  }, [setUser]);

  // ✅ Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Show user details modal
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(res.data);
    } catch (err) {
      console.error("Error fetching user details", err);
    }
  };

  // Navigation helpers
  const goToComplaints = () => navigate("/post-a-complaint");
  const goToLetter = () => navigate("/Letter");
  const goToDashboard = () => navigate("/AnalyticsDashboard");
  const goToTelegramBot = () =>
    window.open("https://t.me/CampusCare_1309_bot", "_blank");

  return (
    <div className="homepage-container">
      {/* Floating Icons */}
      <div className="floating-icons">
        {floatingIcons.map((icon, index) => (
          <span
            key={index}
            className="floating-icon"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      {/* Navbar */}
      <div className="navbar">
        <div className="logo">🌐 CampusCare</div>
        <div className="nav-right">
          {user ? (
            <>
              <div className="profile-section" onClick={fetchUserDetails}>
                <span className="profile-icon">👤</span> {user.name}
              </div>
              <button className="btn-login" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn-login" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {userDetails && (
        <div className="user-details">
          <h2>User Details</h2>
          <p>
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Role:</strong> {userDetails.role}
          </p>
          <p>
            <strong>Department:</strong> {userDetails.department}
          </p>
          <p>
            <strong>Accommodation:</strong> {userDetails.accommodation}
          </p>
          <p>
            <strong>Hostel Type:</strong> {userDetails.hostelType}
          </p>
          <button onClick={() => setUserDetails(null)}>Close</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="homepage-hero">
        <h1>Welcome to CampusCare</h1>
        <p>
          Manage complaints, permissions, letters, events, and stay informed in
          one smart system.
        </p>
        <div className="hero-buttons">
          <button onClick={goToComplaints} className="btn-hero">
            <img src={complaintImg} alt="Complaint" />
            <span>Post a Complaint</span>
          </button>
          <button onClick={goToLetter} className="btn-hero">
            <img src={permissionImg} alt="Letter" />
            <span>Generate Permission Letter</span>
          </button>
          <button onClick={goToDashboard} className="btn-hero">
            <img src={dashboardImg} alt="Dashboard" />
            <span>Analytics Dashboard</span>
          </button>
          <button onClick={goToTelegramBot} className="btn-hero">
            <img src={letterImg} alt="Telegram" />
            <span>Telegram Bot</span>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={complaintImg} alt="Complaint" />
            <h3>Digital Complaint Box</h3>
            <p>
              Submit complaints digitally with images, descriptions, and proofs.
            </p>
          </div>
          <div className="feature-card">
            <img src={permissionImg} alt="Permission" />
            <h3>Permission Requests</h3>
            <p>
              Request leave, event permission, or approvals from faculty, HOD,
              or principal.
            </p>
          </div>
          <div className="feature-card">
            <img src={letterImg} alt="Letter" />
            <h3>Letter Generator</h3>
            <p>
              Generate formal letters for HOD, Warden, or college authorities in
              PDF format.
            </p>
          </div>
          <div className="feature-card">
            <img src={dashboardImg} alt="Dashboard" />
            <h3>Smart Dashboard</h3>
            <p>Visual analytics and complaint statistics across the campus.</p>
          </div>
          <div className="feature-card" onClick={goToTelegramBot}>
            <img src={permissionImg} alt="Telegram Bot" />
            <h3>Telegram Bot Integration</h3>
            <p>
              Access campus services via Telegram. Submit complaints, request
              permissions, and get updates 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        © 2025 CampusCare | Made with ❤️ for Students
      </footer>
    </div>
  );
};

export default HomePage;
