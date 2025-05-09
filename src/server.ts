import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";
import { seedAdmin } from "./seeds/adminSeeder";
import { PORT } from "./config/loadEnv";

dotenv.config();

connectDB();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(PORT, () => {
  //   seedAdmin(); // optional call here
  console.log(`Server running on port ${PORT}`);
});
