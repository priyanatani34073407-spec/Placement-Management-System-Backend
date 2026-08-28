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
// Environment Validation
// ===============================

if (!process.env.JWT_SECRET) {
  console.warn(
    "⚠️ JWT_SECRET is not configured."
  );
}

if (!process.env.MONGO_URI) {
  console.warn(
    "⚠️ MONGO_URI is not configured."
  );
}

// ===============================
// Middleware
// ===============================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

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
      // Allow Postman, curl and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.warn(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error(
          "CORS: Origin not allowed"
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ===============================
// Database Connection
// ===============================

connectDB();

// ===============================
// Health Check
// ===============================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "API is healthy",
      timestamp:
        new Date().toISOString(),
    });
  }
);

// ===============================
// Root Route
// ===============================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Placement Management System API is running",
    });
  }
);

// ===============================
// Authentication Routes
// ===============================

app.use(
  "/auth",
  authRoutes
);

// ===============================
// Protected Routes
// ===============================

app.use(
  "/students",
  requireAuth,
  studentRoutes
);

app.use(
  "/companies",
  requireAuth,
  companyRoutes
);

app.use(
  "/placements",
  requireAuth,
  placementRoutes
);

// ===============================
// 404 Handler
// ===============================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

// ===============================
// Central Error Handler
// ===============================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "Server Error:",
      err
    );

    // CORS error
    if (
      err.message &&
      err.message.startsWith(
        "CORS:"
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Request blocked by CORS policy",
      });
    }

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  }
);

// ===============================
// Server Configuration
// ===============================

const PORT =
  process.env.PORT || 8000;

// ===============================
// Start Server
// ===============================

app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );
    console.log(
      `🌐 Port: ${PORT}`
    );
  }
);
