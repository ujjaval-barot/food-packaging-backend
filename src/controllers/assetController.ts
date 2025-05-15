import { Request, Response } from "express";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const uploadAssets = async (req: Request, res: Response) => {
  try {
    const module = req.query.module as string;
    if (!module) return errorResponse(res, "Module query param required", 400);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      return errorResponse(res, "No files uploaded", 400);

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
