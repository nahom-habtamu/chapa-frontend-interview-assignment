import axios from "axios";
import { apiClient } from "../../common/api-client";
import { mockBanks } from "./mock-data";
import { Bank } from "./types";

const CHAPA_API_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY || "CHASECK_TEST-test-secret-key";

const chapaApi = axios.create({
  baseURL: CHAPA_API_URL,
  headers: {
    "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

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

export const getBanks = async (): Promise<Bank[]> => {
  try {
    const response = await apiClient.get<Bank[]>("/admin/banks");
    return response.data;
  } catch (error) {
    console.warn("Banks API failed, using mock data:", error);
    return mockBanks.slice(0, 3);
  }
};

export const createBank = async (bank: Omit<Bank, "id">): Promise<Bank> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    ...bank,
    id: Date.now().toString(),
  };
};

export const updateBank = async (id: string, bank: Partial<Bank>): Promise<Bank> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const { mockBanks } = await import("./mock-data");
  const existingBank = mockBanks.find(b => b.id === id);

  if (!existingBank) {
    throw new Error("Bank not found");
  }

  return { ...existingBank, ...bank };
};

export const deleteBank = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const { mockBanks } = await import("./mock-data");
  const bank = mockBanks.find(b => b.id === id);

  if (!bank) {
    throw new Error("Bank not found");
  }
};