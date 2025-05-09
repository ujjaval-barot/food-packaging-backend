import "../config/loadEnv"; // Load env first
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import { ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } from "../config/loadEnv";

export const seedAdmin = async () => {
  await mongoose.connect(MONGO_URI);
  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    firstname: "Admin",
    lastname: "Food-Packaging",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Default admin created successfully.");
  process.exit(0);
};

seedAdmin();
