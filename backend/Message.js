// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  userName: { type: String, default: "Anon" },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);
