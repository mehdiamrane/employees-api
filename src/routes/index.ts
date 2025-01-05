import { Router } from "express";
import jsonServer from "json-server";
import { wrapResponse } from "../middleware";
import systemRoutes from "./systemRoutes";
import { config } from "../config";

const router = Router();

// System routes
router.use("/api/v1", systemRoutes);

// JSON Server routes
const jsonRouter = jsonServer.router(config.dbPath);
router.use("/api/v1", wrapResponse, jsonRouter);

export default router;
