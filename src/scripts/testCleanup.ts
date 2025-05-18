import "../config/loadEnv";
import connectDB from "../config/db";
import "../config/cloudinary"; // ensure cloudinary config loaded
import { cleanUpUnusedAssets } from "../jobs/cleanupJob";

(async () => {
  await connectDB(); // ← Important: wait for DB connection
  await cleanUpUnusedAssets();
  process.exit(0);
})();
