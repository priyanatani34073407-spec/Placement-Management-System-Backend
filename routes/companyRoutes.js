import express from "express";
import {
  getCompanies,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany,
  searchCompanies,
} from "../controllers/companyControllers.js";

// Router object
const router = express.Router();

// Searching route (must come before /:id)
router.get("/search", searchCompanies);

// GET all companies
router.get("/", getCompanies);

// GET company by ID
router.get("/:id", getCompanyById);

// POST add a new company
router.post("/", addCompany);

// PUT update a company
router.put("/:id", updateCompany);

// DELETE a company
router.delete("/:id", deleteCompany);

export default router;
