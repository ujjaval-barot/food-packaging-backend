import "../config/loadEnv"; // Load env first
import mongoose from "mongoose";
import { MONGO_URI } from "../config/loadEnv";
import Product from "../models/Product";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI); // 👈 replace with your DB connection string

    const result = await Product.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    const missingActiveCount = await Product.countDocuments({
      isActive: { $exists: false },
    });
    console.log("Documents missing isActive:", missingActiveCount);

    if (missingActiveCount > 0) {
      const result = await Product.updateMany(
        { isActive: { $exists: false } },
        { $set: { isActive: true } }
      );
      console.log(
        `✅ Migration complete. ${result.modifiedCount} product documents updated.`
      );
    } else {
      console.log("No documents found to update.");
    }

    console.log(
      `✅ Migration complete. ${result.modifiedCount} product documents updated.`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

run();
