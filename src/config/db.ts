import mongoose from "mongoose";
import { MONGO_URI } from "./loadEnv";

const connectDB = async () => {
  try {
    mongoose.set("debug", true);
    console.log(`✅ MongoDB connected: ${MONGO_URI}`);
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // stop the server if DB fails
  }
};

export default connectDB;
