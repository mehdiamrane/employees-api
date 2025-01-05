import { Router } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";
import { validatePayload } from "../middleware/validation";
import { createEmployeeSchema, updateEmployeeSchema } from "../validation/employeeSchemas";

const router = Router();

router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.post("/create", validatePayload(createEmployeeSchema), createEmployee);
router.put("/update/:id", validatePayload(updateEmployeeSchema), updateEmployee);
router.delete("/delete/:id", deleteEmployee);

export default router;
