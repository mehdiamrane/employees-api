import { Request, Response, NextFunction } from "express";

export const jsonErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      status: "error",
      data: null,
      message: "Invalid JSON format",
      errors: [
        {
          field: "body",
          message: "Malformed JSON in request body",
        },
      ],
    });
  }
  next(err);
};
