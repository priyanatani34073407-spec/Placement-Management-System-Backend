import express from "express";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
// import companyRoutes from "./routes/companyRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors())

// Call Database Connection
connectDB();

// Student Routes
app.use("/students", studentRoutes);

// Company Routes
// app.use("/companies", companyRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Student & Company API is Running...");
});

// Start Server
app.listen(8000, () => {
  console.log("Server started at http://localhost:8000");
});
