import { Router } from "express";
import { healthCheck, triggerUpdate } from "../controllers/systemController";

const router = Router();

router.get("/health", healthCheck);
router.get("/trigger-update", triggerUpdate);

export default router;
