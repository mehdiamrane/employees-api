import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  cronSchedule:
    process.env.NODE_ENV === "production"
      ? "0 0 * * *" // Every day at midnight (00:00) in production
      : "0 0 * * *", // Every day at midnight (00:00) in development
  dbPath: "db.json",
};

// "0 0 * * * *" // Every hour (at minute 0)
// "0 */10 * * * *" // Every 10 minutes
