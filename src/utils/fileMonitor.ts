import fs from "fs";

export function watchDatabaseFile(): void {
  const dbPath = "db.json";

  // Get initial file stats
  let lastModified = fs.statSync(dbPath).mtime;
  console.log(`Initial database timestamp: ${lastModified}`);

  // Watch for file changes
  fs.watch(dbPath, (eventType, filename) => {
    if (eventType === "change") {
      const newModified = fs.statSync(dbPath).mtime;
      if (newModified.getTime() !== lastModified.getTime()) {
        console.log(`Database file updated at: ${newModified}`);
        lastModified = newModified;
      }
    }
  });
}
