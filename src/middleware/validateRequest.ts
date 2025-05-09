import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects, ZodSchema } from "zod";
import { errorResponse } from "../utils/responseHandler";

type ValidSchema = AnyZodObject | ZodEffects<AnyZodObject>;

export const validateRequest = (
  schema: ValidSchema,
  source: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return errorResponse(res, "Validation failed", 400, errors);
    }

    // Optionally: attach validated data back to request
    req[source] = result.data;
    next();
  };
};
