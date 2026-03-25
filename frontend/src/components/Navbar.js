import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false); // mock login state
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo">🏫 CampusCare</div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/complaints">Complaints</Link>
        <Link to="/about">About</Link>
      </nav>

      <div className="auth">
        {!loggedIn ? (
          <Link to="/login" className="btn primary">Login</Link>
        ) : (
          <div className="profile-menu">
            <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>👤</div>
            {menuOpen && (
              <div className="dropdown">
                <Link to="/profile">My Profile</Link>
                <Link to="/settings">Settings</Link>
                <button onClick={() => setLoggedIn(false)}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
