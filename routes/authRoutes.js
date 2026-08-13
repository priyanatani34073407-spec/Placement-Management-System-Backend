import express from "express";
import {
  register,
  login,
  getMe,
  changePassword,
} from "../controllers/authControllers.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Public authentication routes
router.post("/register", register);
router.post("/login", login);

// Protected authentication routes
router.get("/me", requireAuth, getMe);
router.put("/change-password", requireAuth, changePassword);

export default router;
