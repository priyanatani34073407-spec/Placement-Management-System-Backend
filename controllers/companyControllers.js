import Company from "../models/Company.js";

// ===============================
// Get All Companies
// ===============================

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Get Companies Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

// ===============================
// Get Company By ID
// ===============================

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(
      req.params.id
    );

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
    console.error("Get Company Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch company",
    });
  }
};

// ===============================
// Create Company
// ===============================

export const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      email,
      phone,
      location,
      website,
    } = req.body;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      companyName,
      email: email?.toLowerCase(),
      phone,
      location,
      website,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.error("Create Company Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create company",
    });
  }
};

// ===============================
// Update Company
// ===============================

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(
      req.params.id
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const {
      companyName,
      email,
      phone,
      location,
      website,
    } = req.body;

    company.companyName =
      companyName ?? company.companyName;

    company.email =
      email?.toLowerCase() ?? company.email;

    company.phone =
      phone ?? company.phone;

    company.location =
      location ?? company.location;

    company.website =
      website ?? company.website;

    const updatedCompany = await company.save();

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update Company Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update company",
    });
  }
};

// ===============================
// Delete Company
// ===============================

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(
      req.params.id
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Delete Company Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete company",
    });
  }
};
