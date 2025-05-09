import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | { role: string };
    }
  }
}

export interface CustomJwtPayload {
  userId: string;
  role: "admin" | "user";
}
