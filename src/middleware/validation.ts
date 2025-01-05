import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, ZodTypeAny } from "zod";

export const validatePayload = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = schema.parse(req.body);
    console.log("validatedData:", validatedData);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("req.body:", req.body);
      // console.log("error:", error);
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

// Helper function to identify missing required fields
function getMissingFields(schema: AnyZodObject, data: any): string {
  const shape = schema.shape as Record<string, ZodTypeAny>;
  const missingFields = [];

  for (const [key, value] of Object.entries(shape)) {
    if (!("isOptional" in value) || !value.isOptional()) {
      if (!data || !(key in data)) {
        missingFields.push(key);
      }
    }
  }

  return missingFields.join(", ");
}
