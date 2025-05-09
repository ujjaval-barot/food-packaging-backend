import { z } from "zod";

export const getCategoryByIdSchema = z.object({
  id: z.string(),
});

export type getCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>;

export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
  parentCategory: z.string().optional(),
});

export type createCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    parentCategory: z.string().optional(),
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
