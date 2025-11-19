// routes/messages.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET all messages (oldest → newest)
router.get("/", async (req, res) => {
  try {
    const msgs = await Message.find().sort({ timestamp: 1 }).limit(200);
    res.json(msgs);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// POST a message (public)
router.post("/", async (req, res) => {
  try {
    const { userName, message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const m = await Message.create({ userName: userName || "Anon", message });
    res.status(201).json(m);
  } catch (err) {
    console.error("Post message error:", err);
    res.status(500).json({ error: "Failed to post message" });
  }
});

export default router;
