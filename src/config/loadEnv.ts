import dotenv from "dotenv";
dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

export const MONGO_URI = requiredEnv("MONGO_URI");
export const PORT = process.env.PORT || "5000";
export const ADMIN_EMAIL = requiredEnv("ADMIN_EMAIL");
export const ADMIN_PASSWORD = requiredEnv("ADMIN_PASSWORD");
export const JWT_SECRET = requiredEnv("JWT_SECRET");
