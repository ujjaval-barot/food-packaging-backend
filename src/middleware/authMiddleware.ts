import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/custom";
import { JWT_SECRET } from "../config/loadEnv";

export const authenticateOptional: RequestHandler = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.user = { role: "user" }; // guest role
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error("Invalid token");
    (error as any).status = 401;
    next(error);
  }
};
