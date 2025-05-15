import { Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryById,
  getCategoryById,
  getCategoryList,
  updateCategoryById,
  updateCategoryTag,
} from "../services/categoryService";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const createCategory = async (req: Request, res: Response) => {
  const category = await createCategoryService(req.body); // errors bubble to asyncHandler
  successResponse(res, { category }, "Category created successfully.");
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categories = await getCategoryList();
  successResponse(
    res,
    { categories: categories || [] },
    "Categories data fetched successfully."
  );
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await getCategoryById(req.params.id);

  if (!category) {
    errorResponse(res, "Category not found", 404);
    return;
  }

  successResponse(res, { category }, "Category fetched successfully.");
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await updateCategoryById(req.params.id, req.body);
  if (!category) {
    errorResponse(res, "Category not found", 404);
    return;
  }
  successResponse(res, { category }, "Categorie updated successfully.");
};

export const manageCategoryTag = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { tag, action } = req.body;

  const category = await updateCategoryTag(id, tag, action);
  successResponse(res, { category }, `Tag ${action}ed successfully`);
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await deleteCategoryById(req.params.id);
  if (!category) {
    errorResponse(res, "Category not found", 404);
    return;
  }
  successResponse(res, {}, "Category deleted successfully.");
};
