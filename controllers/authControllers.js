import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===============================
// Generate JWT Token
// ===============================

const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ===============================
// Register User
// ===============================

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    const normalizedName = String(name).trim();
    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    // Validate name
    if (normalizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters",
      });
    }

    // Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    // Validate password
    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    // Only allow roles defined by User model
    const userRole =
      role === "admin" ? "admin" : "student";

    // Check duplicate email
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(
        String(password),
        10
      );

    // Create user
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
    });

    // Generate token
    const token = generateToken(
      user._id,
      user.role
    );

    res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Registration Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "User already exists with this email",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Registration failed",
    });
  }
};

// ===============================
// Login User
// ===============================

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    // Password uses select:false in User model
    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        String(password),
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token = generateToken(
      user._id,
      user.role
    );

    res.status(200).json({
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
    console.error(
      "Login Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ===============================
// Get Current User
// ===============================

export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user =
      await User.findById(
        req.user.id
      ).select("-password");

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
    console.error(
      "Get Current User Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch user details",
    });
  }
};

// ===============================
// Change Password
// ===============================

export const changePassword = async (
  req,
  res
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least 6 characters",
      });
    }

    const user =
      await User.findById(
        req.user.id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentPasswordMatch =
      await bcrypt.compare(
        String(currentPassword),
        user.password
      );

    if (!currentPasswordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    const samePassword =
      await bcrypt.compare(
        String(newPassword),
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from the current password",
      });
    }

    user.password =
      await bcrypt.hash(
        String(newPassword),
        10
      );

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to change password",
    });
  }
};
