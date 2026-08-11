import Placement from "../models/Placement.js";
import Student from "../models/Student.js";

// ======================
// Get All Placements
// ======================
export async function getPlacements(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPlacements = await Placement.countDocuments();

    const placements = await Placement.find()
      .populate("student", "studentName email branch cgpa")
      .populate("company", "companyName location jobRole")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      placements,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPlacements / limit),
        totalPlacements,
        limit,
        hasNextPage: page < Math.ceil(totalPlacements / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Get Placement By ID
// ======================
export async function getPlacementById(req, res) {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate("student", "studentName email branch cgpa")
      .populate("company", "companyName location jobRole");

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Add Placement
// ======================
export async function addPlacement(req, res) {
  try {
    const placement = await Placement.create(req.body);

    const populated = await placement.populate([
      { path: "student", select: "studentName email branch cgpa" },
      { path: "company", select: "companyName location jobRole" },
    ]);

    res.status(201).json({
      success: true,
      message: "Placement Recorded Successfully",
      placement: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Update Placement (e.g. change status)
// ======================
export async function updatePlacement(req, res) {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: "student", select: "studentName email branch cgpa" },
      { path: "company", select: "companyName location jobRole" },
    ]);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement Updated Successfully",
      placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Delete Placement
// ======================
export async function deletePlacement(req, res) {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Aggregate Stats (for the Reports page)
// ======================
export async function getPlacementStats(req, res) {
  try {
    const totalStudents = await Student.countDocuments();

    const statusBreakdown = await Placement.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const branchBreakdown = await Placement.aggregate([
      { $match: { status: "Selected" } },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },
      { $group: { _id: "$studentInfo.branch", count: { $sum: 1 } } },
    ]);

    const topCompanies = await Placement.aggregate([
      { $match: { status: "Selected" } },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyInfo",
        },
      },
      { $unwind: "$companyInfo" },
      {
        $group: {
          _id: "$companyInfo.companyName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const selectedCount =
      statusBreakdown.find((s) => s._id === "Selected")?.count || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalPlaced: selectedCount,
        placementRate:
          totalStudents > 0
            ? Number(((selectedCount / totalStudents) * 100).toFixed(1))
            : 0,
        statusBreakdown,
        branchBreakdown,
        topCompanies,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
