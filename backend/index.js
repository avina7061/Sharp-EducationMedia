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

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Middlewares
app.use(express.json());

app.use(
  cookieParser({
    secure: true,
    sameSite: "none",
    domain: ".onrender.com",
  })
);
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://sharp-educationmedia.onrender.com"
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

// Log cookies on every request (you can remove this after debugging)
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies); // Logs cookies in the request
  next(); // Make sure to call next to move to the next middleware/route
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Serve frontend assets (if any)
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server with DB connection
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
