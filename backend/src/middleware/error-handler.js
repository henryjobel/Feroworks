import { ZodError } from "zod";
import { fail } from "../utils/response.js";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return fail(res, 400, "Validation failed.", error.flatten());
  }

  console.error(error);
  return fail(res, error.statusCode || 500, error.message || "Internal server error.");
}
