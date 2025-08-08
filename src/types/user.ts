export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUser extends User {
  role: "admin";
}

export interface RegularUser extends User {
  role: "user";
}