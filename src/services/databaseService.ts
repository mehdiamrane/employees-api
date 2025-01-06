import fs from "fs";
import { generateData } from "../utils/generators";
import { logCronExecution } from "../utils/logger";
import { config } from "../config";

let lastUpdateTime: Date | null = null;

export const getLastUpdateTime = (): Date | null => lastUpdateTime;

export function updateDatabase(): void {
  try {
    const data = generateData();
    fs.writeFileSync(config.dbPath, JSON.stringify(data, null, 2));
    lastUpdateTime = new Date();
    logCronExecution("Database successfully updated");
  } catch (error) {
    logCronExecution(`Error updating database: ${error}`);
    // If error is due to missing directory, create it
    if (error instanceof Error && error.message.includes("ENOENT")) {
      try {
        const data = generateData();
        fs.writeFileSync(config.dbPath, JSON.stringify(data, null, 2));
        lastUpdateTime = new Date();
        logCronExecution("Database created successfully");
      } catch (retryError) {
        logCronExecution(`Failed to create database: ${retryError}`);
      }
    }
  }
}
