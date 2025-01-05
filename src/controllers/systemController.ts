import { Request, Response } from "express";
import fs from "fs";
import { config } from "../config";
import { updateDatabase, getLastUpdateTime } from "../services/databaseService";

export const healthCheck = (req: Request, res: Response): void => {
  const stats = fs.statSync(config.dbPath);

  res.json({
    status: "success",
    data: {
      lastCronUpdate: getLastUpdateTime()?.toISOString(),
      fileLastModified: stats.mtime.toISOString(),
      fileSize: stats.size,
      uptime: process.uptime(),
    },
  });
};

export const triggerUpdate = (req: Request, res: Response): void => {
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
};
