import { Request, Response } from "express";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { errorResponse, successResponse } from "../utils/responseHandler";
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from "../constants/enum";

export const uploadAssets = async (req: Request, res: Response) => {
  try {
    const module = req.query.module as string;
    if (!module) return errorResponse(res, "Module query param required", 400);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      return errorResponse(res, "No files uploaded", 400);

    files.forEach((file) => {
      const isImage = file.mimetype.startsWith("image/");
      const isVideo = file.mimetype.startsWith("video/");

      if (isImage && file.size > MAX_IMAGE_SIZE) {
        throw new Error(`Image ${file.originalname} exceeds 5MB limit`);
      }
      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        throw new Error(`Video ${file.originalname} exceeds 50MB limit`);
      }
    });

    const uploads = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, module, file.originalname)
      )
    );

    successResponse(res, { uploads }, "Assets uploaded successfully");
  } catch (error: any) {
    console.error(error);
    errorResponse(res, error.message);
  }
};
