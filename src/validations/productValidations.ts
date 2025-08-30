import { z } from "zod";
import { ASSET_TYPES, TAGS } from "../constants/enum";

export const getProductByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
});

export type getProductByIdInput = z.infer<typeof getProductByIdSchema>;

const assetSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  type: z.enum(ASSET_TYPES),
});

// Specification Schema
const specificationSchema = z.object({
  title: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
});

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price must be greater than or equal to 0"),
  discount: z
    .number({
      invalid_type_error: "Discount must be a number",
    })
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100")
    .optional()
    .default(0),

  highlights: z.array(z.string()).optional(),
  specifications: z.array(specificationSchema).optional(),
  category: z.string(), // Mongo ObjectId as string
  similarProducts: z.array(z.string()).optional(),
  assets: z
    .array(assetSchema)
    .min(1, "At least one asset is required")
    .max(5, "Maximum 5 assets allowed"),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    inStock: z.boolean().optional(),
    price: z.number().min(0).optional(),
    discount: z.number().min(0).max(100).optional(),

    highlights: z.array(z.string()).optional(),
    specifications: z.array(specificationSchema).optional(),
    category: z.string().optional(),
    similarProducts: z.array(z.string()).optional(),
    assets: z.array(assetSchema).max(5, "Maximum 5 assets allowed").optional(),
    isFeatured: z.boolean().optional(),
    isPopular: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided for update.",
      });
    }
  });

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  isFeatured: z.string().optional(),
  isPopular: z.string().optional(),
});

export const productListByCategoryParamsSchema = z.object({
  id: z.string(),
});

export const productListByLabelSchema = z.object({
  label: z.enum(TAGS),
});

export const activateDeactivateProductSchema = z.object({
  flag: z.boolean(),
});
