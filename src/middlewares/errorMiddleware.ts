// Error middleware
import type { ErrorRequestHandler } from "express";
import { type QueryError } from "mysql2";
import AppError from "../errors/AppErrors.js";
import sqlErrors from "../errors/sqlErrors.js";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  const sqlErr = err as QueryError;

  if (sqlErr?.code && sqlErrors[sqlErr.code as keyof typeof sqlErrors]) {
    const mapped = sqlErrors[sqlErr.code as keyof typeof sqlErrors];

    return res.status(mapped.status).json({
      code: mapped.code,
      message: mapped.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
};

export default errorMiddleware;
