import jsonServer from "json-server";
import cron from "node-cron";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { generateData } from "./utils/generators";
import { limiter, simulateDelay, simulateErrors, wrapResponse } from "./middleware";
import dotenv from "dotenv";
import swaggerDocument from "./swagger.json"; // Make sure tsconfig.json has "resolveJsonModule": true

// Load environment variables from .env file
dotenv.config();

// Create server
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Database update function
function updateDatabase(): void {
  const data = generateData();
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
  console.log("Database updated at:", new Date().toLocaleString());
}

// Initial data generation
updateDatabase();

// Schedule refresh every day at midnight
cron.schedule("0 0 * * *", () => {
  updateDatabase();
});

// Apply middlewares
server.use(middlewares);
server.use(limiter);
server.use(simulateDelay);
server.use(simulateErrors);

// API documentation
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use JSON Server router with wrapped responses
const router = jsonServer.router("db.json");
server.use("/api/v1", wrapResponse, router);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
