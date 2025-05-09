import { Request, Response } from "express";
import {
  createProductService,
  deleteProductById,
  getProductById,
  getProductList,
  updateProductById,
} from "../services/productService";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await createProductService(req.body);
  successResponse(res, { product }, "Product created successfully.");
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await getProductList();
  successResponse(res, { products }, "Products fetched successfully.");
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await getProductById(req.params.id);
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(res, { product }, "Product fetched successfully.");
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await updateProductById(req.params.id, req.body);
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(res, { product }, "Product updated successfully.");
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await deleteProductById(req.params.id);
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(res, {}, "Product deleted successfully.");
};
