import { z } from "zod";

export const createEmployeeSchema = z.object({
  employee_name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters"),
  employee_salary: z
    .number()
    .min(0, "Salary must be a positive number")
    .max(1000000, "Salary must not exceed 1,000,000"),
  employee_age: z
    .number()
    .int("Age must be an integer")
    .min(18, "Employee must be at least 18 years old")
    .max(100, "Employee must not be older than 100 years"),
  profile_image: z.string().url("Profile image must be a valid URL").optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
