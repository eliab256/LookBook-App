// Error middleware
import type { ErrorRequestHandler } from "express";
import AppError from "../errors/AppErrors.js";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default errorMiddleware;
