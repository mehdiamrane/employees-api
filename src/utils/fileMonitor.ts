import fs from "fs";
import { config } from "../config";
import { generateData } from "./generators";

export function watchDatabaseFile(): void {
  // Create db.json if it doesn't exist
  if (!fs.existsSync(config.dbPath)) {
    const initialData = generateData();
    fs.writeFileSync(config.dbPath, JSON.stringify(initialData, null, 2));
    console.log(`Created initial database file at: ${config.dbPath}`);
  }

  // Get initial file stats
  let lastModified = fs.statSync(config.dbPath).mtime;
  console.log(`Initial database timestamp: ${lastModified}`);

  // Watch for file changes
  fs.watch(config.dbPath, (eventType, filename) => {
    if (eventType === "change") {
      const newModified = fs.statSync(config.dbPath).mtime;
      if (newModified.getTime() !== lastModified.getTime()) {
        console.log(`Database file updated at: ${newModified}`);
        lastModified = newModified;
      }
    }
  });
}
