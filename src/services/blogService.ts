import { Request } from "express";
import Blog from "../models/Blog";
import APIFeatures from "../utils/apiFeatures";
import {
  createBlogInput,
  updateBlogInput,
} from "../validations/blogValidation";

export const getPublicBlogList = async (req: Request) => {
  const query = Blog.find({ isActive: true });

  const features = new APIFeatures(query, req.query, {
    searchFields: ["title", "description"],
  })
    .search()
    .sort()
    .paginate();

  const blogs = await features.query;

  // total count for pagination meta
  const totalBlogs = await Blog.countDocuments({ isActive: true });

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const meta = {
    totalBlogs,
    page,
    limit,
    hasNextPage: page * limit < totalBlogs,
    hasPreviousPage: page > 1,
  };

  return { blogs, meta };
};

export const getAdminBlogList = async (req: Request) => {
  // Build base query
  const blogQuery = Blog.find();

  // Apply APIFeatures for search, sort, paginate
  const features = new APIFeatures(blogQuery, req.query, {
    searchFields: ["title", "description", "content"],
  })
    .filter()
    .search()
    .sort()
    .paginate();

  // Execute final query
  const blogs = await features.query;

  // Total count for pagination meta
  const totalBlogs = await Blog.countDocuments();

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const meta = {
    totalBlogs,
    page,
    limit,
    hasNextPage: page * limit < totalBlogs,
    hasPreviousPage: page > 1,
  };

  return { blogs, meta };
};

export const getBlogById = async (id: string, includeInactive = false) => {
  const filter: any = { _id: id };
  if (!includeInactive) {
    filter.isActive = true;
  }

  return await Blog.findOne(filter);
};

export const createBlogService = async (body: createBlogInput) => {
  return await Blog.create(body);
};

export const updateBlogById = async (id: string, body: updateBlogInput) => {
  return await Blog.findByIdAndUpdate(id, body, { new: true });
};

export const activateDeactivateBlogById = async (id: string, flag: boolean) => {
  return await Blog.findByIdAndUpdate(id, { isActive: flag }, { new: true });
};

export const deleteBlogById = async (id: string) => {
  return await Blog.findByIdAndDelete(id);
};
