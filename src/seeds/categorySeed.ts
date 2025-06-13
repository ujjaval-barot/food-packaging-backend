import "../config/loadEnv"; // Load env first
import mongoose from "mongoose";
import Category from "../models/Category"; // 👈 adjust the relative path if needed
import { MONGO_URI } from "../config/loadEnv";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI); // 👈 replace with your DB connection string

    const result = await Category.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    console.log(
      `✅ Migration complete. ${result.modifiedCount} category documents updated.`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

run();
