export type UserRole = "user" | "admin" | "super_admin";

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  isDeactivated: boolean; // New field for consistent deactivation state
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseUser {
  role: "user";
}

export interface AdminUser extends BaseUser {
  role: "admin" | "super_admin";
  permissions?: string[];
}

export interface AuthToken {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface AuthState {
  user: BaseUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  user: BaseUser;
  token: AuthToken;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}