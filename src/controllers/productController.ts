import { Request, Response } from "express";
import * as productService from "../services/productService";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await productService.createProductService(req.body);
  successResponse(res, { product }, "Product created successfully.");
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { products, meta } = await productService.getProductsByCategoryId(req);
  successResponse(
    res,
    { products },
    "Products fetched successfully.",
    200,
    meta
  );
};

export const getProductsByLabel = async (req: Request, res: Response) => {
  const { products, meta } = await productService.getProductListByLabel(req);
  successResponse(res, { products }, "Products by label fetched.", 200, meta);
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(res, { product }, "Product fetched successfully.");
};

export const getAdminProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { products, meta } = await productService.getAdminProductsList(req);
  successResponse(
    res,
    { products: products || [] },
    "Products data fetched successfully.",
    200,
    meta
  );
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await productService.updateProductById(
    req.params.id,
    req.body
  );
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(res, { product }, "Product updated successfully.");
};

export const activateDeactivateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { flag } = req.body;

  const category = await productService.activateDeactivateById(
    req.params.id,
    flag
  );
  if (!category) {
    errorResponse(res, "Category not found", 404);
    return;
  }
  successResponse(res, {}, "Category deleted successfully.");
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await productService.deleteProductById(req.params.id);
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(res, {}, "Product deleted successfully.");
};
