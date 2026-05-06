import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const error = result.error as ZodError;

      const message = error.issues
        .map((issue) => issue.message)
        .join(", ");

      res.status(400).json({
        success: false,
        message: message || "Validation failed",
        errors: error.issues
      });

      return;
    }

    const parsedData = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    if (parsedData.body) {
      req.body = parsedData.body;
    }

    if (parsedData.params) {
      req.params = parsedData.params as Record<string, string>;
    }

    if (parsedData.query) {
      req.query = parsedData.query as Request["query"];
    }

    next();
  };
