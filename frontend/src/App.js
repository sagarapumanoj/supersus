import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import CampusPortalAuth from "./pages/CampusPortalAuth";
import Dashboard from "./pages/AnalyticsDashboard";
import Letter from "./pages/Letter";
import PostAComplaint from "./pages/PostAComplaint"; 
import "./App.css";
import axios from "axios";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      const fetchUser = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error("Error fetching logged-in user:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      };
      fetchUser();
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage user={user} setUser={setUser} />} />
        <Route path="/login" element={<CampusPortalAuth setUser={setUser} />} />
        <Route path="/Letter" element={<Letter user={user} />} /> 
        <Route path="/post-a-complaint" element={<PostAComplaint user={user} />} />
        <Route path="/AnalyticsDashboard" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
