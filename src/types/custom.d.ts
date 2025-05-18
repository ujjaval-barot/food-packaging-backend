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

export type CategoryLabel = "featured" | "trending" | "popular";

export interface IAsset {
  url: string;
  publicId: string;
  type: "image" | "video";
}

export type LeanDoc<T> = T extends Document ? Omit<T, keyof Document> : T;
