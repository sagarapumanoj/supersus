import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // 🔥 change in production

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // ✅ Signup
  const signup = async (formData) => {
    const res = await axios.post(`${API_URL}/signup`, formData);
    return res.data;
  };

  // ✅ Login
  const login = async (credentials) => {
    const res = await axios.post(`${API_URL}/login`, credentials);
    if (res.data.token) {
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  // ✅ Profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      logout(); // token expired or invalid
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return { user, token, signup, login, logout };
};
