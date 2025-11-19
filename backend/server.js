// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import messageRoutes from "./routes/messages.js";

const app = express();
const server = http.createServer(app);

// connect DB
connectDB(process.env.MONGO_URL);

// Socket.IO (optional realtime for chat)
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*" }
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    // broadcast to all
    io.emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

// middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);

// start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
