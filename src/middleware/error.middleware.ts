import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
