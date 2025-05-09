import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { authenticateOptional } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createCategorySchema,
  getCategoryByIdSchema,
  updateCategorySchema,
} from "../validations/categoryValidations";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get(
  "/",
  authenticateOptional,
  asyncHandler(categoryController.getCategories)
);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category object
 *       404:
 *         description: Category not found
 */
router.get(
  "/:id",
  authenticateOptional,
  validateRequest(getCategoryByIdSchema, "params"),
  asyncHandler(categoryController.getCategory)
);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Category created
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateOptional,
  authorize(["admin"]),
  validateRequest(createCategorySchema),
  asyncHandler(categoryController.createCategory)
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Category updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.put(
  "/:id",
  authenticateOptional,
  authorize(["admin"]),
  validateRequest(getCategoryByIdSchema, "params"),
  validateRequest(updateCategorySchema, "body"),
  asyncHandler(categoryController.updateCategory)
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.delete(
  "/:id",
  authenticateOptional,
  authorize(["admin"]),
  validateRequest(getCategoryByIdSchema, "params"),
  asyncHandler(categoryController.deleteCategory)
);

export default router;
