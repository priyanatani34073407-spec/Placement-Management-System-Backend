import mongoose from "mongoose";
import Placement from "../models/Placement.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";

// ===============================
// Allowed Placement Statuses
// ===============================

const ALLOWED_STATUSES = [
  "Applied",
  "Shortlisted",
  "Selected",
  "Rejected",
];

// ===============================
// Get All Placements
// ===============================

export async function getPlacements(req, res) {
  try {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit, 10) || 10,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const [totalPlacements, placements] =
      await Promise.all([
        Placement.countDocuments(),

        Placement.find()
          .populate(
            "student",
            "studentName email branch cgpa"
          )
          .populate(
            "company",
            "companyName location hrName email jobRole package"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

    const totalPages =
      Math.ceil(
        totalPlacements / limit
      );

    res.status(200).json({
      success: true,
      placements,
      pagination: {
        currentPage: page,
        totalPages,
        totalPlacements,
        limit,
        hasNextPage:
          page < totalPages,
        hasPrevPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get Placements Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch placements",
    });
  }
}

// ===============================
// Get Placement By ID
// ===============================

export async function getPlacementById(
  req,
  res
) {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid placement ID",
      });
    }

    const placement =
      await Placement.findById(id)
        .populate(
          "student",
          "studentName email branch cgpa"
        )
        .populate(
          "company",
          "companyName location hrName email jobRole package"
        )
        .lean();

    if (!placement) {
      return res.status(404).json({
        success: false,
        message:
          "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      placement,
    });
  } catch (error) {
    console.error(
      "Get Placement By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch placement",
    });
  }
}

// ===============================
// Add Placement
// ===============================

export async function addPlacement(
  req,
  res
) {
  try {
    const {
      student,
      company,
      package: placementPackage,
      status,
      appliedDate,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !student ||
      !company ||
      !placementPackage
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student, company and package are required",
      });
    }

    // Validate Student ID
    if (
      !mongoose.Types.ObjectId.isValid(
        student
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid student ID",
      });
    }

    // Validate Company ID
    if (
      !mongoose.Types.ObjectId.isValid(
        company
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid company ID",
      });
    }

    // Validate status
    const finalStatus =
      status || "Applied";

    if (
      !ALLOWED_STATUSES.includes(
        finalStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid placement status",
      });
    }

    // Check student exists
    const existingStudent =
      await Student.findById(student);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    // Check company exists
    const existingCompany =
      await Company.findById(company);

    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message:
          "Company not found",
      });
    }

    // Validate date if provided
    let finalAppliedDate =
      Date.now();

    if (appliedDate) {
      const parsedDate =
        new Date(appliedDate);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid applied date",
        });
      }

      finalAppliedDate =
        parsedDate;
    }

    // Check duplicate placement
    const existingPlacement =
      await Placement.findOne({
        student,
        company,
      });

    if (existingPlacement) {
      return res.status(409).json({
        success: false,
        message:
          "Placement for this student and company already exists",
      });
    }

    // Create placement
    const placement =
      await Placement.create({
        student,
        company,
        package:
          String(
            placementPackage
          ).trim(),
        status: finalStatus,
        appliedDate:
          finalAppliedDate,
        notes: notes
          ? String(notes).trim()
          : undefined,
      });

    // Populate response
    const populated =
      await Placement.findById(
        placement._id
      )
        .populate(
          "student",
          "studentName email branch cgpa"
        )
        .populate(
          "company",
          "companyName location hrName email jobRole package"
        )
        .lean();

    res.status(201).json({
      success: true,
      message:
        "Placement recorded successfully",
      placement: populated,
    });
  } catch (error) {
    console
