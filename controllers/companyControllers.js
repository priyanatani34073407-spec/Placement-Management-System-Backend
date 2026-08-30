import Company from "../models/Company.js";

// ===============================
// Get All Companies
// ===============================

export const getCompanies = async (req, res) => {
  try {
    const companies =
      await Company.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(
      "Get Companies Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch companies",
    });
  }
};

// ===============================
// Get Company By ID
// ===============================

export const getCompanyById = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
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
    console.error(
      "Get Company Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch company",
    });
  }
};

// ===============================
// Add Company
// ===============================

export const addCompany = async (
  req,
  res
) => {
  try {
    const {
      companyName,
      location,
      hrName,
      email,
      phone,
      package: companyPackage,
      jobRole,
      eligibility,
    } = req.body;

    if (
      !companyName ||
      !location ||
      !hrName ||
      !email ||
      !phone ||
      !companyPackage ||
      !jobRole ||
      !eligibility
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All company fields are required",
      });
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    const normalizedPhone =
      String(phone).trim();

    if (!/^\d{10}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must contain exactly 10 digits",
      });
    }

    const existingCompany =
      await Company.findOne({
        email: normalizedEmail,
      });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message:
          "A company with this email already exists",
      });
    }

    const company =
      await Company.create({
        companyName:
          String(companyName).trim(),
        location:
          String(location).trim(),
        hrName:
          String(hrName).trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        package:
          String(companyPackage).trim(),
        jobRole:
          String(jobRole).trim(),
        eligibility:
          String(eligibility).trim(),
      });

    res.status(201).json({
      success: true,
      message:
        "Company created successfully",
      company,
    });
  } catch (error) {
    console.error(
      "Add Company Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A company with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create company",
    });
  }
};

// ===============================
// Search Companies
// ===============================

export const searchCompanies = async (
  req,
  res
) => {
  try {
    const search =
      String(req.query.q || "").trim();

    if (!search) {
      return res.status(200).json({
        success: true,
        count: 0,
        companies: [],
      });
    }

    const companies =
      await Company.find({
        $or: [
          {
            companyName: {
              $regex: search,
              $options: "i",
            },
          },
          {
            location: {
              $regex: search,
              $options: "i",
            },
          },
          {
            hrName: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
          {
            jobRole: {
              $regex: search,
              $options: "i",
            },
          },
          {
            eligibility: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      }).sort({
        companyName: 1,
      });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(
      "Search Companies Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to search companies",
    });
  }
};

// ===============================
// Update Company
// ===============================

export const updateCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
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
      location,
      hrName,
      email,
      phone,
      package: companyPackage,
      jobRole,
      eligibility,
    } = req.body;

    if (companyName !== undefined) {
      company.companyName =
        String(companyName).trim();
    }

    if (location !== undefined) {
      company.location =
        String(location).trim();
    }

    if (hrName !== undefined) {
      company.hrName =
        String(hrName).trim();
    }

    if (email !== undefined) {
      company.email =
        String(email)
          .trim()
          .toLowerCase();
    }

    if (phone !== undefined) {
      const normalizedPhone =
        String(phone).trim();

      if (
        !/^\d{10}$/.test(
          normalizedPhone
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number must contain exactly 10 digits",
        });
      }

      company.phone =
        normalizedPhone;
    }

    if (companyPackage !== undefined) {
      company.package =
        String(companyPackage).trim();
    }

    if (jobRole !== undefined) {
      company.jobRole =
        String(jobRole).trim();
    }

    if (eligibility !== undefined) {
      company.eligibility =
        String(eligibility).trim();
    }

    const updatedCompany =
      await company.save();

    res.status(200).json({
      success: true,
      message:
        "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error(
      "Update Company Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Another company already uses this email",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update company",
    });
  }
};

// ===============================
// Delete Company
// ===============================

export const deleteCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
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
      message:
        "Company deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Company Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete company",
    });
  }
};
