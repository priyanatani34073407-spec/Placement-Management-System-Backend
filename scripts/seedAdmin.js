// Creates (or updates the password of) the initial admin user.
// Run with: npm run seed
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const name = process.env.ADMIN_NAME || "Admin";

  await connectDB();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hashedPassword;
    existing.name = name;
    await existing.save();
    console.log(`✅ Admin user updated: ${email}`);
  } else {
    await User.create({ name, email, password: hashedPassword, role: "admin" });
    console.log(`✅ Admin user created: ${email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error("❌ Failed to seed admin user:", error.message);
  process.exit(1);
});
