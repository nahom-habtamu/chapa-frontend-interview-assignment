import axios from "axios";
import { apiClient } from "../../common/api-client";
import { AdminUser, PaginatedResponse, PaginationParams } from "../../common/types";

// Get all admins (super admin functionality)
export const getAdmins = async (params?: PaginationParams): Promise<PaginatedResponse<AdminUser>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<AdminUser>>("/admin/admins", {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch admins");
    }
    throw new Error("Network error occurred");
  }
};

// Create new admin (super admin only)
export const createAdmin = async (admin: Omit<AdminUser, "id" | "createdAt" | "updatedAt">): Promise<AdminUser> => {
  try {
    const response = await apiClient.post<AdminUser>("/admin/admins", admin);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create admin");
    }
    throw new Error("Network error occurred");
  }
};

// Update admin (super admin only)
export const updateAdmin = async (id: string, admin: Partial<AdminUser>): Promise<AdminUser> => {
  try {
    const response = await apiClient.put<AdminUser>(`/admin/admins/${id}`, admin);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update admin");
    }
    throw new Error("Network error occurred");
  }
};

// Deactivate admin (super admin only)
export const deactivateAdmin = async (id: string): Promise<AdminUser> => {
  try {
    const response = await apiClient.patch<AdminUser>(`/admin/admins/${id}/deactivate`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to deactivate admin");
    }
    throw new Error("Network error occurred");
  }
};

// Reactivate admin (super admin only)
export const reactivateAdmin = async (id: string): Promise<AdminUser> => {
  try {
    const response = await apiClient.patch<AdminUser>(`/admin/admins/${id}/reactivate`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to reactivate admin");
    }
    throw new Error("Network error occurred");
  }
};

// Delete admin permanently (super admin only)
export const deleteAdmin = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/admins/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete admin");
    }
    throw new Error("Network error occurred");
  }
};