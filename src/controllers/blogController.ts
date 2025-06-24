import { Request, Response } from "express";
import {
  createBlogService,
  deleteBlogById,
  getAdminBlogList,
  getBlogById,
  getPublicBlogList,
  updateBlogById,
  activateDeactivateBlogById,
} from "../services/blogService";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const createBlog = async (req: Request, res: Response) => {
  const blog = await createBlogService(req.body);
  successResponse(res, { blog }, "Blog created successfully.");
};

export const getBlogs = async (req: Request, res: Response) => {
  const { blogs, meta } = await getPublicBlogList(req);
  successResponse(res, { blogs }, "Blogs fetched successfully.", 200, meta);
};

export const getAdminBlogs = async (req: Request, res: Response) => {
  const { blogs, meta } = await getAdminBlogList(req);
  successResponse(res, { blogs }, "Admin blog list fetched.", 200, meta);
};

export const getBlog = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const includeInactive = req.user?.role === "admin";

  const blog = await getBlogById(blogId, includeInactive);
  if (!blog) {
    errorResponse(res, "Blog not found", 404);
    return;
  }

  successResponse(res, { blog }, "Blog fetched successfully.");
};

export const updateBlog = async (req: Request, res: Response) => {
  const blog = await updateBlogById(req.params.id, req.body);
  if (!blog) {
    errorResponse(res, "Blog not found", 404);
    return;
  }

  successResponse(res, { blog }, "Blog updated successfully.");
};

export const activateDeactivateBlog = async (req: Request, res: Response) => {
  const { flag } = req.body;

  const blog = await activateDeactivateBlogById(req.params.id, flag);
  if (!blog) {
    errorResponse(res, "Blog not found", 404);
    return;
  }

  successResponse(res, {}, "Blog status updated successfully.");
};

export const deleteBlog = async (req: Request, res: Response) => {
  const blog = await deleteBlogById(req.params.id);
  if (!blog) {
    errorResponse(res, "Blog not found", 404);
    return;
  }

  successResponse(res, {}, "Blog deleted successfully.");
};
