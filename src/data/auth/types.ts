export type UserRole = "user" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
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
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  user: User;
  token: AuthToken;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}