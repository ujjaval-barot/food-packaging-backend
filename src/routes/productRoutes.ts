import { Router } from "express";
import * as productController from "../controllers/productController";
import {
  authenticate,
  authorize,
  validateRequest,
  uploadMiddleware,
} from "../middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  activateDeactivateProductSchema,
  createProductSchema,
  getProductByIdSchema,
  productListByCategoryParamsSchema,
  updateProductSchema,
  productListQuerySchema,
} from "../validations/productValidations";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get(
  "/by-category/:id",
  authenticate(false),
  validateRequest(productListByCategoryParamsSchema, "params"),
  validateRequest(productListQuerySchema, "query"),
  asyncHandler(productController.getProducts)
);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get(
  "/",
  authenticate(false),
  validateRequest(productListQuerySchema, "query"),
  asyncHandler(productController.getProducts)
);

/**
 * @swagger
 * /api/products/{id}:

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
  asyncHandler(productController.getAdminProducts)
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
router.get(
  "/:id",
  authenticate(false),
  validateRequest(getProductByIdSchema, "params"),
  asyncHandler(productController.getProduct)
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
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
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *               - category
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Bad request
 */
router.post(
  "/",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(createProductSchema),
  asyncHandler(productController.createProduct)
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
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
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getProductByIdSchema, "params"),
  validateRequest(updateProductSchema, "body"),
  asyncHandler(productController.updateProduct)
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
  validateRequest(getProductByIdSchema, "params"),
  validateRequest(activateDeactivateProductSchema, "body"),
  asyncHandler(productController.activateDeactivateCategory)
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getProductByIdSchema, "params"),
  asyncHandler(productController.deleteProduct)
);

export default router;
