import Category from "../models/Category";
import Product from "../models/Product";
import { CategoryLabel } from "../types/custom";
import APIFeatures from "../utils/apiFeatures";
import {
  createCategoryInput,
  updateCategoryInput,
} from "../validations/categoryValidations";

export const getCategoryList = async () => {
  return await Category.find({ parentCategory: null });
};

export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  const subCategories = await Category.find({ parentCategory: id });

  return {
    category: { ...category, subCategories: subCategories },
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

export const deleteCategoryById = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};
