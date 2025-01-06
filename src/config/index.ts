import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  cronSchedule:
    process.env.NODE_ENV === "production"
      ? "0 0 * * *" // Every day at midnight (00:00) in production
      : "0 0 * * *", // Every day at midnight (00:00) in development
  dbPath: process.env.DB_PATH || "db.json",
  simulatedDelay: {
    min: Number(process.env.SIMULATED_DELAY_MIN || 0),
    max: Number(process.env.SIMULATED_DELAY_MAX || 1000),
  },
  simulatedErrors: {
    percentage: Number(process.env.SIMULATED_ERROR_PERCENTAGE || 10),
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  },
};
