import Company from "../models/Company.js";

// ======================
// Get All Companies (with pagination + sorting)
// ======================
export async function getCompanies(req, res) {
  try {
    const sortField = req.query.sort || "companyName";
    const order = req.query.order || "asc";
    const sortOrder = order === "asc" ? 1 : -1;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalCompanies = await Company.countDocuments();

    const companies = await Company.find()
      .skip(skip)
      .limit(limit)
      .sort({
        [sortField]: sortOrder,
      });

    res.status(200).json({
      success: true,
      companies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCompanies / limit),
        totalCompanies,
        limit,
        hasNextPage: page < Math.ceil(totalCompanies / limit),
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
// Get Company By ID
// ======================
export async function getCompanyById(req, res) {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Add Company
// ======================
export async function addCompany(req, res) {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: "Company Registered Successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Update Company
// ======================
export async function updateCompany(req, res) {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company Updated Successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Delete Company
// ======================
export async function deleteCompany(req, res) {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================
// Search Companies
// ======================
export async function searchCompanies(req, res) {
  try {
    const search = req.query.q || "";

    const companies = await Company.find({
      $or: [
        { companyName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { hrName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { jobRole: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
