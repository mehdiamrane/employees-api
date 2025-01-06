import { faker } from "@faker-js/faker";
import { Employee } from "../types";

export function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];
  for (let i = 0; i < count; i++) {
    employees.push({
      id: i + 1,
      name: faker.person.fullName(),
      salary: faker.helpers.rangeToNumber({ min: 30000, max: 150000 }),
      age: faker.helpers.rangeToNumber({ min: 20, max: 65 }),
      profile_image: faker.image.avatarGitHub(),
    });
  }
  return employees;
}

export function generateData(count: number = 24) {
  return {
    employees: generateEmployees(count),
  };
}
