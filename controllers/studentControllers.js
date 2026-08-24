import Student from "../models/Student.js";

// ===============================
// Get All Students
// ===============================

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// ===============================
// Get Student By ID
// ===============================

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

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
    console.error("Get Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

// ===============================
// Create Student
// ===============================

export const createStudent = async (req, res) => {
  try {
    const {
      studentName,
      email,
      phone,
      branch,
      cgpa,
    } = req.body;

    // Validate required fields
    if (!studentName || !email || !branch) {
      return res.status(400).json({
        success: false,
        message: "Student name, email and branch are required",
      });
    }

    // Check duplicate email
    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    const student = await Student.create({
      studentName,
      email: email.toLowerCase(),
      phone,
      branch,
      cgpa,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create student",
    });
  }
};

// ===============================
// Update Student
// ===============================

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(
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

    student.studentName =
      studentName ?? student.studentName;

    student.email =
      email?.toLowerCase() ?? student.email;

    student.phone =
      phone ?? student.phone;

    student.branch =
      branch ?? student.branch;

    student.cgpa =
      cgpa ?? student.cgpa;

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

// ===============================
// Delete Student
// ===============================

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(
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
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};
