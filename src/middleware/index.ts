import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../config";

export * from "./errorHandler";

export const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.max, // limit each IP to 100 requests per windowMs
});

export const simulateDelay = (req: Request, res: Response, next: NextFunction) => {
  const delay = Math.random() * (config.simulatedDelay.max - config.simulatedDelay.min) + config.simulatedDelay.min;
  setTimeout(next, delay);
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

  if (Math.random() < config.simulatedErrors.percentage / 100) {
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
