import multer from "multer";
import { Request } from "express";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_SIZE,
} from "../constants/enum";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const isAllowed =
    ALLOWED_IMAGE_TYPES.includes(file.mimetype) ||
    ALLOWED_VIDEO_TYPES.includes(file.mimetype);

  if (!isAllowed) {
    return cb(new Error("Only image and video files are allowed"));
  }
  cb(null, true);
};

const limits = {
  fileSize: MAX_VIDEO_SIZE, // highest possible — per-file checking happens later
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits,
}).array("files", 5);
