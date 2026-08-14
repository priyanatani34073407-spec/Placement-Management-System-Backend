import express from "express";
import {
  getPlacements,
  getPlacementById,
  addPlacement,
  updatePlacement,
  deletePlacement,
  getPlacementStats,
} from "../controllers/placementControllers.js";

const router = express.Router();

// GET aggregate stats (for Reports page) — before /:id
router.get("/stats", getPlacementStats);

// GET all placements
router.get("/", getPlacements);

// GET placement by ID
router.get("/:id", getPlacementById);

// POST record a placement
router.post("/", addPlacement);

// PUT update a placement
router.put("/:id", updatePlacement);

// DELETE a placement
router.delete("/:id", deletePlacement);

export default router;
