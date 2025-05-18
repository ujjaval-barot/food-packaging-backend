import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import assetRoutes from "./routes/assetRoutes";
import { errorResponse } from "./utils/responseHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);

setupSwagger(app);

// Global error handler - should be the last middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err.stack);
  errorResponse(
    res,
    err.message || "Internal Server Error",
    err.status || 500,
    err.errors || null
  );
});

export default app;
