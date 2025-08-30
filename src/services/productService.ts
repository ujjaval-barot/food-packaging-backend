import { Request } from "express";
import Category from "../models/Category";
import Product from "../models/Product";
import APIFeatures from "../utils/apiFeatures";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../validations/productValidations";
import mongoose from "mongoose";

export const createProductService = async (body: CreateProductInput) => {
  const product = await Product.create(body);

  // Update category product count
  await Category.findByIdAndUpdate(product.category, {
    $inc: { productCount: 1 },
  });

  // Also update parent category if exists
  const category = await Category.findById(product.category);
  if (category?.parentCategory) {
    await Category.findByIdAndUpdate(category.parentCategory, {
      $inc: { productCount: 1 },
    });
  }

  return product;
};

export const getProducts = async (req: Request) => {
  const { categoryId, isFeatured, isPopular } = req.query;

  const filter: any = {};

  if (categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId as string)) {
      throw new Error("Invalid category id format");
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Invalid category id");
    }

    const subCategories = await Category.find({ parentCategory: categoryId });

    const categoryIds = [
      new mongoose.Types.ObjectId(categoryId as string),
      ...subCategories.map((sub) => sub._id),
    ];

    const uniqueCategoryIds = [
      ...new Set(categoryIds.map((id) => id.toString())),
    ].map((idStr) => new mongoose.Types.ObjectId(idStr));

    filter.category = { $in: uniqueCategoryIds };
  }

  if (isFeatured) {
    filter.isFeatured = isFeatured === "true";
  }

  if (isPopular) {
    filter.isPopular = isPopular === "true";
  }

  // Build product query
  const productQuery = Product.find(filter).populate("category");

  const features = new APIFeatures(productQuery, req.query, {
    searchFields: ["name", "description"],
  })
    .search()
    .sort()
    .paginate();

  const products = await features.query;

  const totalProducts = await Product.countDocuments(filter);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const meta = {
    totalProducts,
    page,
    limit,
    hasNextPage: page * limit < totalProducts,
    hasPreviousPage: page > 1,
  };

  return { products, meta };
};

export const getAdminProductsList = async (req: Request) => {
  const { category } = req.query;

  const filter: any = {};

  if (category) {
    if (category === "null") {
      filter.category = null;
    } else {
      // find subcategories under this category
      const subCategories = await Category.find({ parentCategory: category });
      const categoryIds = [
        new mongoose.Types.ObjectId(category as string),
        ...subCategories.map((sub) => sub._id),
      ];

      filter.category = { $in: categoryIds };
    }
  }

  const productQuery = Product.find(filter).populate("category");

  const features = new APIFeatures(productQuery, req.query, {
    searchFields: ["name", "description"],
  })
    .filter()
    .search()
    .sort()
    .paginate();

  const products = await features.query;

  const totalProducts = await Product.countDocuments(filter);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const meta = {
    totalProducts,
    page,
    limit,
    hasNextPage: page * limit < totalProducts,
    hasPreviousPage: page > 1,
  };

  return { products, meta };
};

// export const getProductsByCategory = async (
//   categoryId: string,
//   queryParams: any
// ) => {
//   const subCategories = await Category.find({ parent: categoryId })
//     .select("_id")
//     .lean();
//   const categoryIds = [categoryId, ...subCategories.map((c) => c._id)];

//   const query = Product.find({ category: { $in: categoryIds } }).populate(
//     "category"
//   );

//   const features = new APIFeatures(query, queryParams, {
//     searchFields: ["name", "description"],
//   })
//     .search()
//     .sort()
//     .paginate();

//   const products = await features.query;
//   const total = await Product.countDocuments({
//     category: { $in: categoryIds },
//   });

//   const page = parseInt(queryParams.page as string) || 1;
//   const limit = parseInt(queryParams.limit as string) || 10;

//   const meta = {
//     total,
//     page,
//     limit,
//     hasNextPage: page * limit < total,
//     hasPreviousPage: page > 1,
//   };

//   return { products, meta };
// };

export const getProductById = async (id: string) => {
  return await Product.findById(id)
    .populate("category")
    .populate("similarProducts");
};

export const updateProductById = async (
  id: string,
  body: UpdateProductInput
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldProduct = await Product.findById(id).session(session);
    if (!oldProduct) {
      throw new Error("Product not found");
    }

    // If category changed
    if (body.category && body.category !== oldProduct.category.toString()) {
      // Decrement old category
      await Category.findByIdAndUpdate(
        oldProduct.category,
        { $inc: { productCount: -1 } },
        { session }
      );

      const oldCategory = await Category.findById(oldProduct.category).session(
        session
      );
      if (oldCategory?.parentCategory) {
        await Category.findByIdAndUpdate(
          oldCategory.parentCategory,
          { $inc: { productCount: -1 } },
          { session }
        );
      }

      // Increment new category
      await Category.findByIdAndUpdate(
        body.category,
        { $inc: { productCount: 1 } },
        { session }
      );

      const newCategory = await Category.findById(body.category).session(
        session
      );
      if (newCategory?.parentCategory) {
        await Category.findByIdAndUpdate(
          newCategory.parentCategory,
          { $inc: { productCount: 1 } },
          { session }
        );
      }
    }

    // Finally update product
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return updatedProduct;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const activateDeactivateById = async (id: string, flag: boolean) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: flag },
    { new: true }
  );

  if (product) {
    const incValue = flag ? 1 : -1;

    await Category.findByIdAndUpdate(product.category, {
      $inc: { productCount: incValue },
    });

    const category = await Category.findById(product.category);
    if (category?.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $inc: { productCount: incValue },
      });
    }
  }

  return product;
};

export const deleteProductById = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);

  if (product) {
    await Category.findByIdAndUpdate(product.category, {
      $inc: { productCount: -1 },
    });

    const category = await Category.findById(product.category);
    if (category?.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $inc: { productCount: -1 },
      });
    }
  }

  return product;
};
