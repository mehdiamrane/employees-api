import { z } from "zod";
import { createEmployeeSchema, updateEmployeeSchema } from "../validation/employeeSchemas";

export interface Employee {
  id: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image: string;
}

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
