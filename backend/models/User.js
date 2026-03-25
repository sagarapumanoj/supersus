// models/User.js
import mongoose from "mongoose";

const validRoles = ["student", "faculty", "staff", "coordinator", "hod", "warden", "admin"];
const validDepartments = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AI", "DS"]; // add yours
const validAccommodation = ["hosteller", "dayscholar"];
const validHostelTypes = ["boys", "girls"]; // add more if needed

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  role: {
    type: String,
    enum: validRoles,
    required: [true, "Role is required"],
  },
  department: {
    type: String,
    enum: validDepartments,
    required: [true, "Department is required"],
  },
  accommodation: {
    type: String,
    enum: validAccommodation,
  },
  hostelType: {
    type: String,
    enum: validHostelTypes,
    validate: {
      validator: function (val) {
        if (this.accommodation === "hosteller" && !val) return false;
        return true;
      },
      message: "Hostel type is required for hostellers",
    },
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
