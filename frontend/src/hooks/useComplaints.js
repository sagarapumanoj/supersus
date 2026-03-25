import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const useComplaints = (token) => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (token) fetchComplaints();
  }, [token]);

  // ✅ Fetch All Complaints
  const fetchComplaints = async () => {
    const res = await axios.get(`${API_URL}/complaints`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  };

  // ✅ Submit Complaint
  const submitComplaint = async (data) => {
    const res = await axios.post(`${API_URL}/complaints`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints([res.data.complaint, ...complaints]);
    return res.data;
  };

  // ✅ Update Status
  const updateStatus = async (id, status) => {
    const res = await axios.put(
      `${API_URL}/complaints/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComplaints(
      complaints.map((c) => (c._id === id ? res.data : c))
    );
    return res.data;
  };

  // ✅ Support Complaint
  const supportComplaint = async (id) => {
    const res = await axios.put(
      `${API_URL}/complaints/${id}/support`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComplaints(
      complaints.map((c) => (c._id === id ? res.data : c))
    );
    return res.data;
  };

  return { complaints, submitComplaint, updateStatus, supportComplaint };
};
