import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  mediaUrl: { type: String }, // will hold image/video file path or cloud URL
  status: { type: String, default: "pending" },
  support: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Complaint", complaintSchema);
