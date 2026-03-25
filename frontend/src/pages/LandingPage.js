import React, { useState, useEffect } from 'react';
import "./LandingPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";
const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      {/* Animated Background Elements */}
      <div className="animated-bg">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${25 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Dynamic cursor effect */}
      <div 
        className="cursor-effect"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Header */}
      <header className="landing-header">
        <div className="logo">🚀 CampusCare</div>
        
        <nav>
          <a href="#features" onClick={(e) => handleNavClick(e, '#features')}>Features</a>
          <a href="#wow" onClick={(e) => handleNavClick(e, '#wow')}>Wow Features</a>
          <a href="#tech" onClick={(e) => handleNavClick(e, '#tech')}>Tech Stack</a>
          <button className="btn-primary">Dashboard</button>
        </nav>

        <div className="mobile-menu">
          <button>☰</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glass">
          <h1>Smart Complaint & Resource Management</h1>
          <p>
            For both College & Hostel students 🌍<br />
            <span className="highlight">Say goodbye to delays, lost papers & frustration.</span>
          </p>
          <div className="hero-buttons">
           <button className="btn-primary big">
  <Link to="/homepage" style={{ color: "inherit", textDecoration: "none" }}>
    Get Started ✨
  </Link>
</button> <button className="btn-secondary">Watch Demo</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Core Features</h2>
        <div className="features-grid">
          {[
            { emoji: '📥', title: 'Unified Complaint Box', desc: 'Log campus-wide complaints with photos, videos & location tags.', icon: 'fas fa-inbox' },
            { emoji: '⚡', title: 'Smart Prioritization', desc: 'AI auto-flags emergencies and routes them quickly.', icon: 'fas fa-brain' },
            { emoji: '📊', title: 'Analytics Dashboard', desc: 'Heatmaps & trends to fix root causes of recurring issues.', icon: 'fas fa-chart-line' },
            { emoji: '📝', title: 'Letter Generator', desc: 'Generate leave requests, permissions, and official applications instantly.', icon: 'fas fa-file-alt' },
            { emoji: '🔲', title: 'QR Complaint Box', desc: 'Scan QR codes across campus to quickly log issues.', icon: 'fas fa-qrcode' }
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-emoji">{feature.emoji}</span>
              <span className="feature-icon"><i className={feature.icon}></i></span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wow Features */}
      <section id="wow" className="wow-features">
        <h2>Wow Features ✨</h2>
        <div className="wow-grid">
          {[
            { emoji: '🤖', title: 'AI Complaint Categorizer', desc: 'Automatically categorizes and routes complaints' },
            { emoji: '📱', title: 'QR Code Complaint Box', desc: 'Scan and submit complaints instantly' },
            { emoji: '💬', title: 'WhatsApp/Telegram Bot', desc: 'Submit complaints via messaging apps' }
          ].map((feature, index) => (
            <div key={index} className="wow-card">
              <span className="wow-emoji">{feature.emoji}</span>
              <h3 className="wow-title">{feature.title}</h3>
              <p className="wow-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 CampusCare | Built at Hackathon 🚀</p>
      </footer>
    </div>
  );
};

export default LandingPage;
