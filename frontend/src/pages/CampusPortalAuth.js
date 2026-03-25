import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./CampusPortalAuth.css";

const API_BASE = "http://localhost:5000/api";

const CampusPortalAuth = ({ setUser }) => {   // ✅ accept setUser from props
  const [activeForm, setActiveForm] = useState("signin");
  const [captchaCode, setCaptchaCode] = useState("");
  const [selectedAccommodation, setSelectedAccommodation] = useState("");
  const [selectedHostelType, setSelectedHostelType] = useState("");
  const [signupSuccessMessage, setSignupSuccessMessage] = useState(""); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    signinEmail: "",
    signinPassword: "",
    signinRole: "",
    captchaInput: "",
    signupName: "",
    signupEmail: "",
    signupPassword: "",
    signupConfirmPassword: "",
    roleSelect: "",
    departmentSelect: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    generateCaptcha();

    // ✅ Auto login if already authenticated
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      navigate("/homepage");
    }
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(captcha);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const showForm = (formType) => {
    setActiveForm(formType);
    setErrors({});
    if (formType === "signup") setSignupSuccessMessage(""); 
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidCollegeEmail = (email) =>
    isValidEmail(email) && (email.endsWith(".edu") || email.includes("@college"));
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const validateSignIn = () => {
    const newErrors = {};
    if (!formData.signinEmail || !isValidCollegeEmail(formData.signinEmail))
      newErrors.signinEmail = "Please enter a valid college email";
    if (!formData.signinPassword)
      newErrors.signinPassword = "Password is required";
    if (!formData.signinRole)
      newErrors.signinRole = "Please select your role";
    if (formData.captchaInput.toUpperCase() !== captchaCode.toUpperCase())
      newErrors.captchaInput = "CAPTCHA verification failed";
    return newErrors;
  };

  const validateSignUp = () => {
    const newErrors = {};
    if (!formData.signupName) newErrors.signupName = "Please enter your full name";
    if (!formData.signupEmail || !isValidCollegeEmail(formData.signupEmail))
      newErrors.signupEmail = "Please use a valid college email";
    if (!formData.signupPassword || !isStrongPassword(formData.signupPassword))
      newErrors.signupPassword =
        "Password must be at least 8 characters with uppercase, lowercase, and numbers";
    if (formData.signupPassword !== formData.signupConfirmPassword)
      newErrors.signupConfirmPassword = "Passwords do not match";
    if (!formData.roleSelect) newErrors.roleSelect = "Please select your role";
    if (formData.roleSelect === "student" && !selectedAccommodation)
      newErrors.accommodationError = "Please select your accommodation type";
    if (selectedAccommodation === "hosteller" && !selectedHostelType)
      newErrors.hostelTypeError = "Please select your hostel type";
    if (!formData.departmentSelect)
      newErrors.departmentSelect = "Please select your department";
    return newErrors;
  };

  // ------------------ LOGIN ------------------
  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = validateSignIn();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.signinEmail,
          password: formData.signinPassword,
          role: formData.signinRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // ✅ Persist token and user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Update parent state
      setUser(data.user);

      navigate("/homepage");
    } catch (err) {
      alert(err.message);
    }
  };

  // ------------------ SIGNUP ------------------
  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = validateSignUp();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.signupName,
          email: formData.signupEmail,
          password: formData.signupPassword,
          role: formData.roleSelect,
          department: formData.departmentSelect,
          accommodation: selectedAccommodation,
          hostelType: selectedHostelType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      setActiveForm("signin");
      setSignupSuccessMessage("Account created successfully! Please log in.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      {/* Tabs */}
      <div className="tabs">
        <div className={`tab ${activeForm === "signin" ? "active" : ""}`} onClick={() => showForm("signin")}>Sign In</div>
        <div className={`tab ${activeForm === "signup" ? "active" : ""}`} onClick={() => showForm("signup")}>Sign Up</div>
      </div>

      <div className="form-container">
        {/* Sign In */}
        <form className={`form ${activeForm === "signin" ? "active" : ""}`} onSubmit={handleSignIn}>
          <h2 className="form-title">Sign In</h2>
          {signupSuccessMessage && <div className="success-message">{signupSuccessMessage}</div>}
          
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="signinEmail" value={formData.signinEmail} onChange={handleInputChange} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="signinPassword" id="signin-password" value={formData.signinPassword} onChange={handleInputChange} />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select name="signinRole" value={formData.signinRole} onChange={handleInputChange}>
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="coordinator">Coordinator</option>
              <option value="hod">HOD</option>
              <option value="warden">Warden</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Captcha */}
          <div className="captcha-container">
            <div className="captcha-code">{captchaCode}</div>
            <span className="captcha-refresh" onClick={generateCaptcha}><i className="fas fa-sync-alt"></i></span>
          </div>
          <div className="input-group">
            <label>Enter CAPTCHA</label>
            <input type="text" name="captchaInput" value={formData.captchaInput} onChange={handleInputChange} />
          </div>

          <button type="submit" className="btn">Sign In</button>
        </form>

        {/* Sign Up */}
        <form className={`form ${activeForm === "signup" ? "active" : ""}`} onSubmit={handleSignUp}>
          <h2 className="form-title">Sign Up</h2>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="signupName" value={formData.signupName} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="signupEmail" value={formData.signupEmail} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="signupPassword" id="signup-password" value={formData.signupPassword} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="signupConfirmPassword" id="signup-confirm-password" value={formData.signupConfirmPassword} onChange={handleInputChange} />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select name="roleSelect" value={formData.roleSelect} onChange={handleInputChange}>
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="coordinator">Coordinator</option>
              <option value="hod">HOD</option>
              <option value="warden">Warden</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.roleSelect === "student" && (
            <div className="input-group" id="accommodation-group">
              <label>Accommodation Type</label>
              <div className="option-button" onClick={(e) => setSelectedAccommodation("hosteller")}>Hosteller</div>
              <div className="option-button" onClick={(e) => setSelectedAccommodation("dayscholar")}>Dayscholar</div>
            </div>
          )}

          {selectedAccommodation === "hosteller" && (
            <div className="input-group" id="hostel-type-group">
              <label>Hostel Type</label>
              <div className="option-button" onClick={(e) => setSelectedHostelType("Boys")}>Boys</div>
              <div className="option-button" onClick={(e) => setSelectedHostelType("Girls")}>Girls</div>
            </div>
          )}

          <div className="input-group">
            <label>Department</label>
            <select name="departmentSelect" value={formData.departmentSelect} onChange={handleInputChange}>
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EEE">EEE</option>
            </select>
          </div>

          <button type="submit" className="btn">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default CampusPortalAuth;
