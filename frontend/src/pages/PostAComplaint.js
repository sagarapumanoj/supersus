import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./PostAComplaint.css";

const PostAComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    location: "",
    media: null,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const categories = [
    "Electrical", "Plumbing", "Furniture", "Internet",
    "Security", "Food & Mess", "Cleaning", "Others",
  ];

  const complaintListRef = useRef(null);
  const descriptionRef = useRef(null);

  // ✅ Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        setFormData(prev => ({ ...prev, description: transcript }));
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    } else {
      console.warn("Speech recognition not supported in this browser");
    }
  }, []);

  // ✅ Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (err) {
        console.error("❌ Fetch complaints error:", err);
      }
    };
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "media") {
      setFormData({ ...formData, media: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  // ✅ Toggle voice recording
  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // ✅ Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔹 Attempting to submit complaint...");
    console.log("Form Data:", formData);

    // Validation
    if (!formData.category || !formData.title || !formData.description || !formData.location || !formData.media) {
      alert("Please fill all fields and upload a media file.");
      console.warn("❌ Validation failed: Missing fields or media");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token missing or expired. Please log in again.");
        console.error("❌ Token missing");
        return;
      }

      // Create FormData
      const data = new FormData();
      data.append("category", formData.category);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("media", formData.media);

      console.log("📤 Sending request to backend...");

      const res = await axios.post("http://localhost:5000/api/complaints", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Response received:", res.data);

      if (res.data.complaint) {
        setComplaints([res.data.complaint, ...complaints]);
        setFormData({ category: "", title: "", description: "", location: "", media: null });
        alert("✅ Complaint submitted successfully");
        
        // Stop recording if it was active
        if (isRecording && recognition) {
          recognition.stop();
          setIsRecording(false);
        }
      } else {
        console.warn("⚠️ No complaint object in response:", res.data);
        alert("⚠️ Unexpected response from server");
      }
    } catch (err) {
      console.error("❌ Error submitting complaint:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Status code:", err.response.status);
      }
      alert("❌ Failed to submit complaint. Check console for details.");
    }
  };

  const handleSupport = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/complaints/${id}/support`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(complaints.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      console.error("❌ Support error:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/complaints/${id}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(complaints.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      console.error("❌ Update status error:", err);
    }
  };

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="complaint-system">
      <header className="header">
        <h1>Hostel & College Complaint System</h1>
      </header>

      <div className="layout">
        {/* Complaint Form */}
        <section className="submit-complaint">
          <h2>Submit a Complaint</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-left">
              <h3>Select Category</h3>
              <ul className="category-list">
                {categories.map((cat, i) => (
                  <li key={i} className={formData.category === cat ? "selected" : ""} onClick={() => setFormData({ ...formData, category: cat })}>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
            <div className="form-right">
              <input type="text" placeholder="Complaint Title" id="title" value={formData.title} onChange={handleChange} required />
              <input type="text" placeholder="Location" id="location" value={formData.location} onChange={handleChange} required />
              
              <div className="description-container">
                <textarea 
                  placeholder="Description" 
                  id="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  ref={descriptionRef}
                  required 
                />
                <div className="voice-controls">
                  <button 
                    type="button" 
                    className={`voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                    {isRecording ? 'Stop Recording' : 'Voice Input'}
                  </button>
                  <span className={`recording-status ${isRecording ? 'active' : ''}`}>
                    {isRecording ? 'Listening...' : 'Click to start voice input'}
                  </span>
                </div>
              </div>
              
              <input type="file" id="media" accept="image/*,video/*" onChange={handleChange} required />
              {formData.media && (
                <div className="preview">
                  {formData.media.type.startsWith("image/") ? (
                    <img src={URL.createObjectURL(formData.media)} alt="preview" />
                  ) : (
                    <video src={URL.createObjectURL(formData.media)} controls />
                  )}
                </div>
              )}
              <button type="submit">Submit Complaint</button>
            </div>
          </form>
        </section>

        {/* Complaints List */}
        <section className="complaints-section" ref={complaintListRef}>
          <div className="filter">
            <input type="text" placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {filteredComplaints.length === 0 && <p className="no-complaints">No complaints found</p>}

          <div className="complaints-list">
            {filteredComplaints.map((c) => (
              <div className="complaint-card" key={c._id}>
                <div className="complaint-header">
                  <h3>{c.title}</h3>
                  <span className={`status status-${c.status.replace("-", "")}`}>{c.status}</span>
                </div>
                <p><strong>Location:</strong> {c.location}</p>
                <p>{c.description}</p>
                {c.mediaUrl && (
                  c.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img src={`http://localhost:5000${c.mediaUrl}`} alt="complaint" />
                  ) : (
                    <video src={`http://localhost:5000${c.mediaUrl}`} controls />
                  )
                )}
                <div className="actions">
                  <button onClick={() => handleSupport(c._id)}>👍 {c.support}</button>
                  <button onClick={() => updateStatus(c._id, "in-progress")}>In Progress</button>
                  <button onClick={() => updateStatus(c._id, "resolved")}>Resolved</button>
                </div>
                <small>{new Date(c.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; 2025 Hostel & College Complaint System</p>
      </footer>
    </div>
  );
};

export default PostAComplaint;