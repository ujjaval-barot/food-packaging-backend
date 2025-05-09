import { z } from "zod";

export const getProductByIdSchema = z.object({
  id: z.string().uuid(),
});

export type getProductByIdInput = z.infer<typeof getProductByIdSchema>;

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string().uuid(),
});

export type createProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string().uuid(),
});

export type updateProductInput = z.infer<typeof updateProductSchema>;
