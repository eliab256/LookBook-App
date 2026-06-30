import { z } from "zod";
import AppError from "../errors/AppErrors.js";

function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    throw new AppError(400, firstIssue.message, "VALIDATION_ERROR");
  }

  return result.data;
}

export default validate;
