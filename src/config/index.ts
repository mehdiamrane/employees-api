import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  cronSchedule:
    process.env.NODE_ENV === "production"
      ? "0 */10 * * * *" // Every 10 minutes in production
      : "* * * * *", // Every minute in development
  dbPath: "db.json",
};
