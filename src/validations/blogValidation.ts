import { z } from "zod";
import { ASSET_TYPES } from "../constants/enum";

export const getBlogByIdSchema = z.object({
  id: z.string(),
});
export type getBlogByIdInput = z.infer<typeof getBlogByIdSchema>;

export const createBlogSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  content: z.string({ required_error: "Content (HTML) is required" }),
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

export type createBlogInput = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    isActive: z.boolean().optional(),
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

export type updateBlogInput = z.infer<typeof updateBlogSchema>;
