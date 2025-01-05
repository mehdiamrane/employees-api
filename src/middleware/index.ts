import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export * from "./errorHandler";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const simulateDelay = (req: Request, res: Response, next: NextFunction) => {
  setTimeout(next, Math.random() * 1000);
};

export const simulateErrors = (req: Request, res: Response, next: NextFunction) => {
  // Skip errors for system endpoints and swagger
  if (
    req.path.startsWith("/api/v1/health") ||
    req.path.startsWith("/api/v1/trigger-update") ||
    req.path.startsWith("/api-docs")
  ) {
    return next();
  }

  if (Math.random() < 0.1) {
    return res.status(500).json({
      status: "error",
      data: null,
      message: "Internal server error (simulated)",
    });
  }
  next();
};

export const wrapResponse = (req: Request, res: Response, next: NextFunction) => {
  const oldSend = res.send;
  res.send = function (data) {
    res.send = oldSend;
    return res.send({
      status: "success",
      data: JSON.parse(data),
      message: "Successfully retrieved data",
    });
  };
  next();
};
