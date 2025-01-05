import jsonServer from "json-server";
import cron from "node-cron";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { generateData } from "./utils/generators";
import { limiter, simulateDelay, simulateErrors, wrapResponse } from "./middleware";
import dotenv from "dotenv";
import swaggerDocument from "./swagger.json"; // Make sure tsconfig.json has "resolveJsonModule": true
import { watchDatabaseFile } from "./utils/fileMonitor";

let lastUpdateTime: Date | null = null;

// logging utility
const logCronExecution = (message: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[CRON ${timestamp}] ${message}`);
};

// Load environment variables from .env file
dotenv.config();

// Create server
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Watch for database file changes
watchDatabaseFile();

// Database update function
function updateDatabase(): void {
  try {
    const data = generateData();
    fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
    lastUpdateTime = new Date(); // Add this line
    logCronExecution("Database successfully updated");
  } catch (error) {
    logCronExecution(`Error updating database: ${error}`);
  }
}

// Initial data generation
updateDatabase();

// // Schedule refresh every day at midnight
// cron.schedule("0 0 * * *", () => {
// logCronExecution("Running database update...");
//   updateDatabase();
// });

// Every minute
cron.schedule("* * * * *", () => {
  logCronExecution("Running database update...");
  updateDatabase();
});

// Validate the cron job was scheduled
const job = cron.validate("* * * * *");
if (job) {
  console.log("Cron job successfully scheduled");
} else {
  console.error("Invalid cron expression");
}

// Apply middlewares
server.use(middlewares);
server.use(limiter);
server.use(simulateDelay);
server.use(simulateErrors);

// API documentation
server.use("/api-docs", swaggerUi.serve);
server.get("/api-docs", swaggerUi.setup(swaggerDocument));

// Add health check endpoint
server.get("/api/v1/health", (req, res) => {
  const dbFile = "db.json";
  const stats = fs.statSync(dbFile);

  res.json({
    status: "success",
    data: {
      lastCronUpdate: lastUpdateTime?.toISOString(),
      fileLastModified: stats.mtime.toISOString(),
      fileSize: stats.size,
      uptime: process.uptime(),
    },
  });
});

// Add manual trigger endpoint
server.get("/api/v1/trigger-update", (req, res) => {
  try {
    updateDatabase();
    res.json({
      status: "success",
      message: "Database update triggered successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update database",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Use JSON Server router with wrapped responses
const router = jsonServer.router("db.json");
server.use("/api/v1", wrapResponse, router);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
