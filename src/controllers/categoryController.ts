import { Request, Response } from "express";
import {
  activateDeactivateById,
  createCategoryService,
  deleteCategoryById,
  getAdminCategoriesList,
  getCategoryById,
  getCategoryList,
  updateCategoryById,
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

export const getAdminCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categories, meta } = await getAdminCategoriesList(req);
  successResponse(
    res,
    { categories: categories || [] },
    "Categories data fetched successfully.",
    200,
    meta
  );
};

export const getCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const includeInactive = req.user?.role === "admin"; // 👈 check user role from token

  const category = await getCategoryById(categoryId, includeInactive);

  if (!category) {
    errorResponse(res, "Category not found", 404);
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

export const activateDeactivateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { flag } = req.body;

  const category = await activateDeactivateById(req.params.id, flag);
  if (!category) {
    errorResponse(res, "Category not found", 404);
    return;
  }
  successResponse(res, {}, "Category deleted successfully.");
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
