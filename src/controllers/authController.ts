import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/loadEnv";
import { errorResponse, successResponse } from "../utils/responseHandler";
import { loginUser } from "../services/authService";

// export const register = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { username, password, role } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       username,
//       password: hashedPassword,
//       role,
//     });

// successResponse(res, { user }, "User created successfully.");
//   } catch (error) {
//     next(error);
//   }
// };

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const token = await loginUser(email, password);
  successResponse(res, { token }, "Login successful");
};
