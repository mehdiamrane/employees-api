export interface Employee {
  id: number;
  name: string;
  salary: number;
  age: number;
  profile_image: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message: string;
}
