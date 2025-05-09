import Category from "../models/Category";
import {
  createCategoryInput,
  updateCategoryInput,
} from "../validations/categoryValidations";

export const getCategoryList = async () => {
  return await Category.find().populate("parentCategory");
};

export const getCategoryById = async (id: string) => {
  return await Category.findById(id).populate("parentCategory");
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

export const deleteCategoryById = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};
