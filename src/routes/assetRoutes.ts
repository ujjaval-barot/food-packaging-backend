import express from "express";
import { uploadAssets } from "../controllers/assetController";
import { authenticate, authorize, uploadMiddleware } from "../middleware";

const router = express.Router();

/**
 * @swagger
 * /api/assets/upload:
 *   post:
 *     summary: Upload images or videos (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: module
 *         required: true
 *         description: The module to which this asset belongs (e.g. 'product', 'category')
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Assets uploaded successfully
 */
router.post(
  "/upload",
  authenticate(true),
  authorize(["admin"]),
  uploadMiddleware,
  uploadAssets
);

export default router;
