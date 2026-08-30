import Student from "../models/Student.js";

// ===============================
// Get All Students
// ===============================

export const getStudents = async (
  req,
  res
) => {
  try {
    const students =
      await Student.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch students",
    });
  }
};

// ===============================
// Get Student By ID
// ===============================

export const getStudentsById = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error(
      "Get Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch student",
    });
  }
};

// ===============================
// Add Student
// ===============================

export const addStudent = async (
  req,
  res
) => {
  try {
    const {
      studentName,
      email,
      phone,
      branch,
      cgpa,
    } = req.body;

    if (
      !studentName ||
      !email ||
      !phone ||
      !branch ||
      cgpa === undefined ||
      cgpa === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All student fields are required",
      });
    }

    const normalizedName =
      String(studentName).trim();

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    const normalizedPhone =
      String(phone).trim();

    const numericCgpa =
      Number(cgpa);

    // Validate phone
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

    // Validate CGPA
    if (
      Number.isNaN(numericCgpa) ||
      numericCgpa < 0 ||
      numericCgpa > 10
    ) {
      return res.status(400).json({
        success: false,
        message:
          "CGPA must be between 0 and 10",
      });
    }

    // Validate branch
    const allowedBranches = [
      "CSE",
      "CSM",
      "CSE-AI",
      "CIVIL",
      "DS",
    ];

    if (
      !allowedBranches.includes(
        branch
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch",
      });
    }

    // Check duplicate email
    const existingStudent =
      await Student.findOne({
        email: normalizedEmail,
      });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message:
          "Student with this email already exists",
      });
    }

    const student =
      await Student.create({
        studentName:
          normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        branch,
        cgpa: numericCgpa,
      });

    res.status(201).json({
      success: true,
      message:
        "Student created successfully",
      student,
    });
  } catch (error) {
    console.error(
      "Add Student Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Student with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create student",
    });
  }
};

// ===============================
// Update Student
// ===============================

export const updateStudent = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const {
      studentName,
      email,
      phone,
      branch,
      cgpa,
    } = req.body;

    if (studentName !== undefined) {
      student.studentName =
        String(studentName).trim();
    }

    if (email !== undefined) {
      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const duplicate =
        await Student.findOne({
          email: normalizedEmail,
          _id: {
            $ne: student._id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another student already uses this email",
        });
      }

      student.email =
        normalizedEmail;
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

      student.phone =
        normalizedPhone;
    }

    if (branch !== undefined) {
      const allowedBranches = [
        "CSE",
        "CSM",
        "CSE-AI",
        "CIVIL",
        "DS",
      ];

      if (
        !allowedBranches.includes(
          branch
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid branch",
        });
      }

      student.branch = branch;
    }

    if (cgpa !== undefined) {
      const numericCgpa =
        Number(cgpa);

      if (
        Number.isNaN(numericCgpa) ||
        numericCgpa < 0 ||
        numericCgpa > 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "CGPA must be between 0 and 10",
        });
      }

      student.cgpa =
        numericCgpa;
    }

    const updatedStudent =
      await student.save();

    res.status(200).json({
      success: true,
      message:
        "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error(
      "Update Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update student",
    });
  }
};

// ===============================
// Delete Student
// ===============================

export const deleteStudent = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Student deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete student",
    });
  }
};

// ===============================
// Search Students
// ===============================

export const searchStudents = async (
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
        students: [],
      });
    }

    const students =
      await Student.find({
        $or: [
          {
            studentName: {
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
            phone: {
              $regex: search,
              $options: "i",
            },
          },
          {
            branch: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      }).sort({
        studentName: 1,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(
      "Search Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to search students",
    });
  }
};
