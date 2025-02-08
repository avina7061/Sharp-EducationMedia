import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL || "https://sharp-educationmedia.onrender.com",
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies & authentication
  },
});

const userSocketMap = {}; // Store userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.log("User ID not provided, closing socket.");
    socket.disconnect();
    return;
  }

  console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
  userSocketMap[userId] = socket.id;

  // Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Handle reconnection
  socket.on("reconnect_attempt", () => {
    console.log(`User ${userId} is trying to reconnect...`);
  });
});

export { app, server, io };
