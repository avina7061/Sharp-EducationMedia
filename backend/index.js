import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 8003;
const __dirname = path.resolve();

// Define Allowed Origins (Local + Production)
const allowedOrigins = [
  "http://localhost:5173", // Local frontend (Vite, change if needed)
  "http://localhost:8003", // Local frontend (React default)
  "https://sharp-educationmedia.onrender.com", // Production frontend
];

// CORS Middleware
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Debugging: Log Cookies on User Routes
app.use("/api/v1/user", (req, res, next) => {
  console.log("Cookies at user route:", req.cookies);
  next();
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve frontend assets
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Connect to Database & Start Server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
