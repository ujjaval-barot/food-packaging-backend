import { z } from "zod";
import { ASSET_TYPES, TAG_ACTIONS, TAGS } from "../constants/enum";

export const getCategoryByIdSchema = z.object({
  id: z.string(),
});

export type getCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>;

export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
  labels: z
    .array(z.enum(TAGS))
    .max(3, "You can select up to 3 labels")
    .optional(),
  assets: z
    .array(
      z.object({
        url: z.string(),
        publicId: z.string(),
        type: z.enum(ASSET_TYPES),
      })
    )
    .min(1, "At least one asset is required")
    .max(5, "Maximum 5 assets allowed"),
});

export type createCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    parentCategory: z.string().optional(),
    labels: z
      .array(z.enum(TAGS))
      .max(3, "You can select up to 3 labels")
      .optional(),
    assets: z
      .array(
        z.object({
          url: z.string(),
          publicId: z.string(),
          type: z.enum(ASSET_TYPES),
        })
      )
      .max(5, "Maximum 5 assets allowed")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided for update.",
      });
    }
  });

export type updateCategoryInput = z.infer<typeof updateCategorySchema>;

export const updateCategoryTagSchema = z.object({
  tag: z.enum(TAGS),
  action: z.enum(TAG_ACTIONS),
});

export const activateDeactivateCategorySchema = z.object({
  flag: z.boolean(),
});
