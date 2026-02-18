import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { config } from "../config";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
    return;
  }

  if (err.name === "MulterError") {
    if (err.message === "File too large") {
      res.status(400).json({
        success: false,
        error: "File size exceeds limit",
        code: "FILE_TOO_LARGE",
      });
      return;
    }
  }

  console.error(err);

  res.status(500).json({
    success: false,
    error: config.nodeEnv === "production" ? "Internal server error" : err.message,
    code: "INTERNAL_ERROR",
  });
};
