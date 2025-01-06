import { Request, Response } from "express";
import fs from "fs";
import { config } from "../config";
import { CreateEmployeeDto, Employee, UpdateEmployeeDto } from "../types";
import { createEmployeeSchema } from "../validation/employeeSchemas";
import { ZodError, ZodIssue } from "zod";

function readDatabase(): { employees: Employee[] } {
  const data = fs.readFileSync(config.dbPath, "utf8");
  return JSON.parse(data);
}

function writeDatabase(data: { employees: Employee[] }): void {
  fs.writeFileSync(config.dbPath, JSON.stringify(data, null, 2));
}

export const getAllEmployees = (req: Request, res: Response): void => {
  const data = readDatabase();
  res.json({
    status: "success",
    data: data.employees,
    message: "Successfully retrieved employees",
  });
};

export const getEmployeeById = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const data = readDatabase();
  const employee = data.employees.find((emp) => emp.id === id);

  if (!employee) {
    res.status(404).json({
      status: "error",
      data: null,
      message: `Employee with id ${id} not found`,
    });
    return;
  }

  res.json({
    status: "success",
    data: employee,
    message: "Successfully retrieved employee",
  });
};

export const createEmployee = (req: Request, res: Response): void => {
  try {
    const employeeData: CreateEmployeeDto = req.body;
    const data = readDatabase();

    const newEmployee: Employee = {
      id: Math.max(0, ...data.employees.map((e) => e.id)) + 1,
      profile_image: "",
      ...employeeData,
    };

    data.employees.push(newEmployee);
    writeDatabase(data);

    res.status(201).json({
      status: "success",
      data: newEmployee,
      message: "Successfully created employee",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      data: null,
      message: error instanceof Error ? error.message : "Failed to create employee",
    });
  }
};

export const updateEmployee = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    const updateData: UpdateEmployeeDto = req.body;
    const data = readDatabase();

    const employeeIndex = data.employees.findIndex((emp) => emp.id === id);
    if (employeeIndex === -1) {
      res.status(404).json({
        status: "error",
        data: null,
        message: `Employee with id ${id} not found`,
      });
      return;
    }

    // Create the updated employee object
    const updatedEmployee = {
      ...data.employees[employeeIndex],
      ...updateData,
    };

    // Validate the final employee object against the create schema
    // This ensures all fields are valid, not just the updated ones
    try {
      createEmployeeSchema.parse(updatedEmployee);
    } catch (validationError) {
      res.status(400).json({
        status: "error",
        data: null,
        message: "Validation failed",
        errors: (validationError as ZodError).issues.map((e: ZodIssue) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    // If validation passes, update the employee
    data.employees[employeeIndex] = updatedEmployee;
    writeDatabase(data);

    res.json({
      status: "success",
      data: updatedEmployee,
      message: "Successfully updated employee",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      data: null,
      message: error instanceof Error ? error.message : "Failed to update employee",
    });
  }
};

export const deleteEmployee = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    const data = readDatabase();

    const employeeIndex = data.employees.findIndex((emp) => emp.id === id);
    if (employeeIndex === -1) {
      res.status(404).json({
        status: "error",
        data: null,
        message: `Employee with id ${id} not found`,
      });
      return;
    }

    const deletedEmployee = data.employees[employeeIndex];
    data.employees.splice(employeeIndex, 1);
    writeDatabase(data);

    res.json({
      status: "success",
      data: deletedEmployee,
      message: "Successfully deleted employee",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      data: null,
      message: error instanceof Error ? error.message : "Failed to delete employee",
    });
  }
};
