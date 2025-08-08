import axios from "axios";
import { apiClient } from "../../common/api-client";
import { BaseUser, PaginatedResponse, PaginationParams } from "../../common/types";

// Get all users (admin functionality)
export const getUsers = async (params?: PaginationParams): Promise<PaginatedResponse<BaseUser>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<BaseUser>>("/admin/users", {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
    throw new Error("Network error occurred");
  }
};

// Get single user by ID
export const getUserById = async (id: string): Promise<BaseUser> => {
  try {
    const response = await apiClient.get<BaseUser>(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
    throw new Error("Network error occurred");
  }
};

// Toggle user active status
export const toggleUserStatus = async (id: string): Promise<BaseUser> => {
  try {
    const response = await apiClient.patch<BaseUser>(`/admin/users/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to toggle user status");
    }
    throw new Error("Network error occurred");
  }
};

// Deactivate user (admin action)
export const deactivateUser = async (id: string): Promise<BaseUser> => {
  try {
    const response = await apiClient.patch<BaseUser>(`/admin/users/${id}/deactivate`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to deactivate user");
    }
    throw new Error("Network error occurred");
  }
};

// Reactivate user (admin action)
export const reactivateUser = async (id: string): Promise<BaseUser> => {
  try {
    const response = await apiClient.patch<BaseUser>(`/admin/users/${id}/reactivate`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to reactivate user");
    }
    throw new Error("Network error occurred");
  }
};

// Delete user permanently (super admin only)
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/users/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
    throw new Error("Network error occurred");
  }
};