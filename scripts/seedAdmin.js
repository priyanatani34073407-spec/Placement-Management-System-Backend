// ==========================================
// Admin User Seeder
// ==========================================
// Run:
// npm run seed

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

// ==========================================
// Seed Admin
// ==========================================

async function seedAdmin() {
  try {
    const email = (
      process.env.ADMIN_EMAIL ||
      "admin@gmail.com"
    )
      .trim()
      .toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD ||
      "Admin@123";

    const name =
      process.env.ADMIN_NAME ||
      "Admin";

    // Basic validation
    if (!email) {
      throw new Error(
        "ADMIN_EMAIL cannot be empty"
      );
    }

    if (!password) {
      throw new Error(
        "ADMIN_PASSWORD cannot be empty"
      );
    }

    if (password.length < 6) {
      throw new Error(
        "ADMIN_PASSWORD must contain at least 6 characters"
      );
    }

    if (!name.trim()) {
      throw new Error(
        "ADMIN_NAME cannot be empty"
      );
    }

    // Connect to database
    await connectDB();

    console.log(
      "Checking admin account..."
    );

    const existingAdmin =
      await User.findOne({
        email,
      }).select("+password");

    // ======================================
    // Update Existing Admin
    // ======================================

    if (existingAdmin) {
      const passwordHash =
        await bcrypt.hash(
          password,
          10
        );

      existingAdmin.name =
        name.trim();

      existingAdmin.password =
        passwordHash;

      existingAdmin.role =
        "admin";

      await existingAdmin.save();

      console.log(
        `✅ Admin user updated: ${email}`
      );
    }

    // ======================================
    // Create New Admin
    // ======================================

    else {
      const passwordHash =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({
        name: name.trim(),
        email,
        password: passwordHash,
        role: "admin",
      });

      console.log(
        `✅ Admin user created: ${email}`
      );
    }

    console.log(
      "✅ Admin seeding completed successfully"
    );
  } catch (error) {
    console.error(
      "❌ Failed to seed admin user:"
    );

    console.error(
      error.message
    );

    process.exitCode = 1;
  } finally {
    // Close MongoDB connection
    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed"
      );
    }
  }
}

seedAdmin();
