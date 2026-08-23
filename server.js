import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import connectDB from "./config/db.js";
import { requireAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();

// ===============================
// Middleware
// ===============================

app.use(express.json());

// ===============================
// CORS Configuration
// ===============================

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman, curl, or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS: Origin not allowed"));
    },
    credentials: true,
  })
);

// ===============================
// Database Connection
// ===============================

connectDB();

// ===============================
// Health Check
// ===============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// ===============================
// Root Route
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Placement Management System API is running",
  });
});

// ===============================
// Authentication Routes
// ===============================

app.use("/auth", authRoutes);

// ===============================
// Protected Routes
// ===============================

app.use("/students", requireAuth, studentRoutes);

app.use("/companies", requireAuth, companyRoutes);

app.use("/placements", requireAuth, placementRoutes);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===============================
// Central Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ===============================
// Server Configuration
// ===============================

const PORT = process.env.PORT || 8000;

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
