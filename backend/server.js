import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";
import Complaint from "./models/Complaint.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ✅ Enable CORS
app.use(
  cors({
    origin: "*", // ⚠️ change to frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

/////////////////////////////////////////////////
// 🚀 USER AUTH ROUTES
/////////////////////////////////////////////////

// ✅ Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role, department, accommodation, hostelType } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      accommodation,
      hostelType,
    });

    await user.save();
    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "✅ Login successful", token, user });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Profile
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/////////////////////////////////////////////////
// 🚀 COMPLAINT ROUTES
/////////////////////////////////////////////////

// ✅ Post Complaint with file upload
app.post("/api/complaints", authenticateToken, upload.single("media"), async (req, res) => {
  try {
    const { category, title, description, location } = req.body;

    const complaint = new Complaint({
      user: req.user.id,
      category,
      title,
      description,
      location,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await complaint.save();
    res.status(201).json({ message: "✅ Complaint submitted", complaint });
  } catch (err) {
    console.error("❌ Complaint submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get All Complaints
app.get("/api/complaints", authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email role");
    res.json(complaints);
  } catch (err) {
    console.error("❌ Fetch complaints error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Complaint Status
app.put("/api/complaints/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Support Complaint (increment 👍)
app.put("/api/complaints/:id/support", authenticateToken, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $inc: { support: 1 } },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/////////////////////////////////////////////////
// 🚀 SERVER START
/////////////////////////////////////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
