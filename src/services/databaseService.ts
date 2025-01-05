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
  }
}
