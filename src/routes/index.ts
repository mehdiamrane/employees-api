import { Router } from "express";
import { wrapResponse } from "../middleware";
import systemRoutes from "./systemRoutes";
import employeeRoutes from "./employeeRoutes";

const router = Router();

// System routes
router.use("/api/v1", systemRoutes);

// Employee routes
router.use("/api/v1", employeeRoutes);

export default router;
