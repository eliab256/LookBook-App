// Error middleware
import type { ErrorRequestHandler } from "express";
import AppError from "../errors/AppErrors.js";
import sqlErrors from "../errors/SqlErrors.js";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      console.error("Unexpected operational error:", err);
    }
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  const sqlErr = err as { code?: string };

  if (sqlErr?.code && sqlErr.code in sqlErrors) {
    const mapped = sqlErrors[sqlErr.code as keyof typeof sqlErrors];

    if (mapped.status >= 500) {
      console.error(`SQL system error: ${sqlErr.code}`, { url: req.url, err });
    } else {
      console.warn(`SQL error mapped: ${sqlErr.code}`, { url: req.url });
    }

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
