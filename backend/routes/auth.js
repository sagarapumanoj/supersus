import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, department, accommodation, hostelType } = req.body;

    // Hash password
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
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ error: "Invalid email or role" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
