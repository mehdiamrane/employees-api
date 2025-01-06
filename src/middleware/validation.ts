import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validatePayload = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: "error",
        data: null,
        message: "Validation failed",
        errors: error.issues.map((e) => ({
          field: e.path.length > 0 ? e.path.join(".") : e.code,
          message: e.message,
        })),
      });
    } else {
      next(error);
    }
  }
};
