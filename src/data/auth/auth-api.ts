import axios from "axios";
import { apiClient } from "../common/api-client";
import { mockUsers } from "../common/mock-data";
import { AuthResponse, LoginCredentials, User } from "./types";


const mockLoginUsers = mockUsers.filter(user =>
  !user.isDeactivated && user.isActive
).map(user => ({
  ...user,

  password: user.role === "super_admin" ? "super123" :
    user.role === "admin" ? "admin123" : "user123"
}));


export const getCurrentUserFromAPI = async (token: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get current user");
    }
    throw new Error("Network error occurred");
  }
};

export const getCurrentUser = async (token: string): Promise<User> => {
  try {
    return await getCurrentUserFromAPI(token);
  } catch (error) {
    console.warn("API failed, using mock user:", error);
    await delay(500);
    const user = decodeToken(token);
    if (!user) {
      throw new Error("Invalid token");
    }

    if (user.isDeactivated) {
      throw new Error("User account has been deactivated");
    }

    return user;
  }
};


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  }));
  const signature = btoa("mock-signature");
  return `${header}.${payload}.${signature}`;
};

export const decodeToken = (token: string): User | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    const mockUser = mockUsers.find(u => u.id === payload.sub);
    if (!mockUser) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: mockUser.name,
      role: payload.role,
      isActive: mockUser.isActive,
      isDeactivated: mockUser.isDeactivated,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    };
  } catch {
    return null;
  }
};


export const loginUserAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Network error occurred");
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    return await loginUserAPI(credentials);
  } catch (error) {
    console.warn("API failed, using mock login:", error);

    await delay(1000);
    const user = mockLoginUsers.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.isDeactivated) {
      throw new Error("Account has been deactivated. Please contact support.");
    }

    if (!user.isActive) {
      throw new Error("Account is not active. Please contact support.");
    }


    const expectedPassword = user.role === "super_admin" ? "super123" :
      user.role === "admin" ? "admin123" : "user123";

    if (expectedPassword !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    return {
      user,
      token: {
        access_token: token,
        expires_in: 86400, // 24 hours
        token_type: "Bearer",
      },
    };
  }
};

