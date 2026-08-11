import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured on the server");
  }

  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ======================
// Student Registration
// ======================
export async function register(req, res) {
  try {
    const {
      studentName,
      name,
      email,
      password,
      phone,
      branch,
      cgpa,
    } = req.body;

    const fullName = (studentName || name || "").trim();
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();
    const numericCgpa = Number(cgpa);

    if (!fullName || !normalizedEmail || !password || !normalizedPhone || !branch || cgpa === undefined || cgpa === "") {
      return res.status(400).json({
        success: false,
        message: "All registration fields are required",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (!/^\d{10}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain exactly 10 digits",
      });
    }

    if (numericCgpa < 0 || numericCgpa > 10 || Number.isNaN(numericCgpa)) {
      return res.status(400).json({
        success: false,
        message: "CGPA must be between 0 and 10",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "A student with this email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the login account first.
    const user = await User.create({
      name: fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    try {
      // Create the placement/student record as well.
      const student = await Student.create({
        studentName: fullName,
        email: normalizedEmail,
        phone: normalizedPhone,
        branch,
        cgpa: numericCgpa,
      });

      return res.status(201).json({
        success: true,
        message: "Registration successful. Please log in.",
        student,
      });
    } catch (studentError) {
      // Keep User and Student collections consistent if student creation fails.
      await User.findByIdAndDelete(user._id);
      throw studentError;
    }
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account or student with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
}

// ======================
// Login
// ======================
export async function login(req, res) {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}

// ======================
// Get Current User
// ======================
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
// Change Password
// ======================
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
