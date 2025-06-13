import { Request } from "express";
import Category from "../models/Category";
import Product from "../models/Product";
import { CategoryLabel } from "../types/custom";
import APIFeatures from "../utils/apiFeatures";
import {
  createCategoryInput,
  updateCategoryInput,
} from "../validations/categoryValidations";

export const getCategoryList = async () => {
  return await Category.find({ parentCategory: null, isActive: true });
};

export const getAdminCategoriesList = async (req: Request) => {
  const { parentCategory } = req.query;

  // Build category filter
  const filter: any = {};

  if (parentCategory) {
    // If string 'null' is passed, fetch parent categories
    if (parentCategory === "null") {
      filter.parentCategory = null;
    } else {
      // Else fetch categories under given parent category id
      filter.parentCategory = parentCategory;
    }
  }

  // Build category query with optional filtering
  const categoryQuery = Category.find(filter).populate("parentCategory");

  // Apply search, sort, paginate via APIFeatures utility
  const features = new APIFeatures(categoryQuery, req.query, {
    searchFields: ["name", "description"],
  })
    .search()
    .sort()
    .paginate();

  // Execute final query
  const categories = await features.query;

  // Total count (for pagination meta)
  const totalCategories = await Category.countDocuments(filter);

  // Pagination meta info
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const meta = {
    totalCategories,
    page,
    limit,
    hasNextPage: page * limit < totalCategories,
    hasPreviousPage: page > 1,
  };

  return { categories, meta };
};

export const getCategoryById = async (id: string, includeInactive = false) => {
  const categoryFilter: any = { _id: id };
  const subCategoryFilter: any = { parentCategory: id };

  if (!includeInactive) {
    categoryFilter.isActive = true;
    subCategoryFilter.isActive = true;
  }

  const category = await Category.findOne(categoryFilter).lean();
  if (!category) return null;

  const subCategories = await Category.find(subCategoryFilter).lean();

  return {
    ...category,
    subCategories: subCategories,
  };
};

export const createCategoryService = async (body: createCategoryInput) => {
  return await Category.create(body);
};

export const updateCategoryById = async (
  id: string,
  body: updateCategoryInput
) => {
  return await Category.findByIdAndUpdate(id, body, {
    new: true,
  });
};

export const updateCategoryTag = async (
  categoryId: string,
  tag: CategoryLabel,
  action: string
) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  if (action === "add") {
    if (!category?.labels?.includes(tag)) {
      category?.labels?.push(tag);
    }
  } else if (action === "remove") {
    category.labels = category?.labels?.filter((t) => t !== tag);
  }

  await category.save();
  return category;
};

export const activateDeactivateById = async (id: string, flag: boolean) => {
  return await Category.findByIdAndUpdate(
    id,
    { isActive: flag },
    { new: true }
  );
};

export const deleteCategoryById = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};
