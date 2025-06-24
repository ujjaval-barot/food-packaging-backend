import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { authenticate, authorize, validateRequest } from "../middleware";

import { asyncHandler } from "../utils/asyncHandler";
import {
  activateDeactivateCategorySchema,
  createCategorySchema,
  getCategoryByIdSchema,
  updateCategorySchema,
  updateCategoryTagSchema,
} from "../validations/categoryValidations";

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
  authenticate(false),
  asyncHandler(categoryController.getCategories)
);

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
  "/admin",
  authenticate(true),
  authorize(["admin"]),
  asyncHandler(categoryController.getAdminCategories)
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
  authenticate(false),
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
  authenticate(true),
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
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getCategoryByIdSchema, "params"),
  validateRequest(updateCategorySchema, "body"),
  asyncHandler(categoryController.updateCategory)
);

/**
 * @swagger
 * /api/categories/{id}/manage-tag:
 *   patch:
 *     summary: Add or remove a tag on a category (Admin only)
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
 *               tag:
 *                 type: string
 *                 enum: [featured, trending, popular]
 *               action:
 *                 type: string
 *                 enum: [add, remove]
 *             required:
 *               - tag
 *               - action
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.patch(
  "/:id/manage-tag",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getCategoryByIdSchema, "params"),
  validateRequest(updateCategoryTagSchema, "body"),
  asyncHandler(categoryController.manageCategoryTag)
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.post(
  "/deactivate/:id",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getCategoryByIdSchema, "params"),
  validateRequest(activateDeactivateCategorySchema, "body"),
  asyncHandler(categoryController.activateDeactivateCategory)
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
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getCategoryByIdSchema, "params"),
  asyncHandler(categoryController.deleteCategory)
);

export default router;
