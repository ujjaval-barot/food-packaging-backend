import { Router } from "express";
import * as blogController from "../controllers/blogController";
import { authenticate, authorize, validateRequest } from "../middleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createBlogSchema,
  getBlogByIdSchema,
  updateBlogSchema,
} from "../validations/blogValidation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

// Public — get all active blogs
router.get("/", authenticate(false), asyncHandler(blogController.getBlogs));

// Admin — get all blogs
router.get(
  "/admin",
  authenticate(true),
  authorize(["admin"]),
  asyncHandler(blogController.getAdminBlogs)
);

// Get single blog by id
router.get(
  "/:id",
  authenticate(false),
  validateRequest(getBlogByIdSchema, "params"),
  asyncHandler(blogController.getBlog)
);

// Create blog (admin)
router.post(
  "/",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(createBlogSchema),
  asyncHandler(blogController.createBlog)
);

// Update blog (admin)
router.put(
  "/:id",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getBlogByIdSchema, "params"),
  validateRequest(updateBlogSchema, "body"),
  asyncHandler(blogController.updateBlog)
);

// Delete blog (admin)
router.delete(
  "/:id",
  authenticate(true),
  authorize(["admin"]),
  validateRequest(getBlogByIdSchema, "params"),
  asyncHandler(blogController.deleteBlog)
);

export default router;
