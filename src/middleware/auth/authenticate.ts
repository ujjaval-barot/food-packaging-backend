import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/loadEnv";
import { CustomJwtPayload } from "../../types/custom";

export const authenticate = (required = false): RequestHandler => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      if (required) {
        return res.status(401).json({ message: "Authentication required" });
      }
      req.user = { role: "guest" };
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
      req.user = decoded;
      next();
    } catch (err) {
      if (required) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = { role: "guest" };
      next();
    }
  };
};
