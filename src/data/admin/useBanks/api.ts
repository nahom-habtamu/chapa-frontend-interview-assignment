import axios from "axios";
import { apiClient } from "../../common/api-client";
import { Bank } from "./types";

// Chapa API configuration for banks
const CHAPA_API_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY || "CHASECK_TEST-test-secret-key";

// Create dedicated axios instance for Chapa API
const chapaApi = axios.create({
  baseURL: CHAPA_API_URL,
  headers: {
    "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// Get Banks from Chapa API
export const getBanksFromChapa = async (): Promise<{ data: Bank[] }> => {
  try {
    const response = await chapaApi.get("/banks");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch banks from Chapa");
    }
    throw new Error("Network error occurred");
  }
};

// Internal API endpoints for bank management (for future use)
export const getBanks = async (): Promise<Bank[]> => {
  try {
    const response = await apiClient.get<Bank[]>("/admin/banks");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch banks");
    }
    throw new Error("Network error occurred");
  }
};

export const createBank = async (bank: Omit<Bank, "id">): Promise<Bank> => {
  try {
    const response = await apiClient.post<Bank>("/admin/banks", bank);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create bank");
    }
    throw new Error("Network error occurred");
  }
};

export const updateBank = async (id: string, bank: Partial<Bank>): Promise<Bank> => {
  try {
    const response = await apiClient.put<Bank>(`/admin/banks/${id}`, bank);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update bank");
    }
    throw new Error("Network error occurred");
  }
};

export const deleteBank = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/banks/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete bank");
    }
    throw new Error("Network error occurred");
  }
};