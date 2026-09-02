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

// ======================================
// Placement Statistics
// ======================================
// Keep this BEFORE /:id so "stats"
// is not treated as a placement ID.

router.get(
  "/stats",
  getPlacementStats
);

// ======================================
// Get All Placements
// ======================================

router.get(
  "/",
  getPlacements
);

// ======================================
// Get Placement By ID
// ======================================

router.get(
  "/:id",
  getPlacementById
);

// ======================================
// Add Placement
// ======================================

router.post(
  "/",
  addPlacement
);

// ======================================
// Update Placement
// ======================================

router.put(
  "/:id",
  updatePlacement
);

// ======================================
// Delete Placement
// ======================================

router.delete(
  "/:id",
  deletePlacement
);

export default router;
