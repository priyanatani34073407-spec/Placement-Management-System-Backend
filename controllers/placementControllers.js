import Placement from "../models/Placement.js";
import Student from "../models/Student.js";

// ======================
// Get All Placements
// ======================

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

    const totalPlacements =
      await Placement.countDocuments();

    const placements = await Placement.find()
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
      .limit(limit);

    const totalPages = Math.ceil(
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
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get Placements Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placements",
    });
  }
}

// ======================
// Get Placement By ID
// ======================

export async function getPlacementById(req, res) {
  try {
    const placement =
      await Placement.findById(req.params.id)
        .populate(
          "student",
          "studentName email branch cgpa"
        )
        .populate(
          "company",
          "companyName location hrName email jobRole package"
        );

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
    console.error(
      "Get Placement By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch placement",
    });
  }
}

// ======================
// Add Placement
// ======================

export async function addPlacement(req, res) {
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

    // Validate status
    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Selected",
      "Rejected",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid placement status",
      });
    }

    const placement = await Placement.create({
      student,
      company,
      package: placementPackage,
      status: status || "Applied",
      appliedDate: appliedDate || Date.now(),
      notes,
    });

    const populated =
      await placement.populate([
        {
          path: "student",
          select:
            "studentName email branch cgpa",
        },
        {
          path: "company",
          select:
            "companyName location hrName email jobRole package",
        },
      ]);

    res.status(201).json({
      success: true,
      message: "Placement Recorded Successfully",
      placement: populated,
    });
  } catch (error) {
    console.error("Add Placement Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to record placement",
    });
  }
}

// ======================
// Update Placement
// ======================

export async function updatePlacement(req, res) {
  try {
    const updates = {
      ...req.body,
    };

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Selected",
      "Rejected",
    ];

    if (
      updates.status &&
      !allowedStatuses.includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid placement status",
      });
    }

    const placement =
      await Placement.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "student",
          "studentName email branch cgpa"
        )
        .populate(
          "company",
          "companyName location hrName email jobRole package"
        );

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
    console.error(
      "Update Placement Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update placement",
    });
  }
}

// ======================
// Delete Placement
// ======================

export async function deletePlacement(req, res) {
  try {
    const placement =
      await Placement.findByIdAndDelete(
        req.params.id
      );

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
    console.error(
      "Delete Placement Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete placement",
    });
  }
}

// ======================
// Placement Statistics
// ======================

export async function getPlacementStats(req, res) {
  try {
    const totalStudents =
      await Student.countDocuments();

    const totalPlacements =
      await Placement.countDocuments();

    const statusBreakdown =
      await Placement.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    const branchBreakdown =
      await Placement.aggregate([
        {
          $match: {
            status: "Selected",
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "student",
            foreignField: "_id",
            as: "studentInfo",
          },
        },
        {
          $unwind: "$studentInfo",
        },
        {
          $group: {
            _id: "$studentInfo.branch",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    const topCompanies =
      await Placement.aggregate([
        {
          $match: {
            status: "Selected",
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "company",
            foreignField: "_id",
            as: "companyInfo",
          },
        },
        {
          $unwind: "$companyInfo",
        },
        {
          $group: {
            _id: "$companyInfo.companyName",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 5,
        },
      ]);

    const selectedCount =
      statusBreakdown.find(
        (item) => item._id === "Selected"
      )?.count || 0;

    const rejectedCount =
      statusBreakdown.find(
        (item) => item._id === "Rejected"
      )?.count || 0;

    const shortlistedCount =
      statusBreakdown.find(
        (item) => item._id === "Shortlisted"
      )?.count || 0;

    const appliedCount =
      statusBreakdown.find(
        (item) => item._id === "Applied"
      )?.count || 0;

    const placementRate =
      totalStudents > 0
        ? Number(
            (
              (selectedCount /
                totalStudents) *
              100
            ).toFixed(1)
          )
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalPlacements,
        totalPlaced: selectedCount,
        placementRate,
        applied: appliedCount,
        shortlisted: shortlistedCount,
        selected: selectedCount,
        rejected: rejectedCount,
        statusBreakdown,
        branchBreakdown,
        topCompanies,
      },
    });
  } catch (error) {
    console.error(
      "Placement Statistics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate placement statistics",
    });
  }
}
