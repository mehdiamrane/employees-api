import jsonServer from "json-server";
import cron from "node-cron";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";
import { updateDatabase } from "./services/databaseService";
import { limiter, simulateDelay, simulateErrors } from "./middleware";
import { watchDatabaseFile } from "./utils/fileMonitor";
import { logCronExecution, logServerStatus } from "./utils/logger";
import routes from "./routes";
import swaggerDocument from "./swagger.json";

// Create server
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Initialize
watchDatabaseFile();
updateDatabase();

// Schedule database updates
const cronJob = cron.schedule(config.cronSchedule, () => {
  logCronExecution("Running database update...");
  updateDatabase();
});

// Validate cron job
if (!cron.validate(config.cronSchedule)) {
  console.error("Invalid cron expression");
  process.exit(1);
}

// Apply middlewares
server.use(middlewares);
server.use(limiter);
server.use(simulateDelay);
server.use(simulateErrors);

// API documentation
server.use("/api-docs", swaggerUi.serve);
server.get("/api-docs", swaggerUi.setup(swaggerDocument));

// Routes
server.use(routes);

// Start server
server.listen(config.port, () => {
  logServerStatus(Number(config.port));
});
