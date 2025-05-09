import Product from "../models/Product";
import {
  createProductInput,
  updateProductInput,
} from "../validations/productValidations";

export const createProductService = async (body: createProductInput) => {
  return await Product.create(body);
};

export const getProductList = async () => {
  return await Product.find().populate("category");
};

export const getProductById = async (id: string) => {
  return await Product.findById(id).populate("category");
};

export const updateProductById = async (
  id: string,
  body: updateProductInput
) => {
  return await Product.findByIdAndUpdate(id, body, {
    new: true,
  });
};

export const deleteProductById = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};
