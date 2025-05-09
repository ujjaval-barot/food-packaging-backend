import { Router } from "express";
import * as authController from "../controllers/authController";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { loginReqSchema } from "../validations/authValidation";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post(
  "/login",
  validateRequest(loginReqSchema),
  asyncHandler(authController.login)
);
// router.post('/register', authController.register);

export default router;
