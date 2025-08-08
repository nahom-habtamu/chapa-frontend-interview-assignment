import axios from "axios";
import { apiClient } from "../../common/api-client";
import { PaginatedResponse, PaginationParams } from "../../common/types";
import { Transaction, TransactionFilters, TransactionStats, WalletBalance } from "./types";

// Get user transactions
export const getTransactions = async (
  params?: PaginationParams & TransactionFilters
): Promise<PaginatedResponse<Transaction>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Transaction>>("/user/transactions", {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch transactions");
    }
    throw new Error("Network error occurred");
  }
};

// Get single transaction by ID
export const getTransactionById = async (id: string): Promise<Transaction> => {
  try {
    const response = await apiClient.get<Transaction>(`/user/transactions/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch transaction");
    }
    throw new Error("Network error occurred");
  }
};

// Get wallet balance
export const getWalletBalance = async (): Promise<WalletBalance> => {
  try {
    const response = await apiClient.get<WalletBalance>("/user/wallet/balance");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch wallet balance");
    }
    throw new Error("Network error occurred");
  }
};

// Get transaction statistics
export const getTransactionStats = async (): Promise<TransactionStats> => {
  try {
    const response = await apiClient.get<TransactionStats>("/user/transactions/stats");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch transaction stats");
    }
    throw new Error("Network error occurred");
  }
};

// Cancel transaction (if supported)
export const cancelTransaction = async (id: string): Promise<Transaction> => {
  try {
    const response = await apiClient.patch<Transaction>(`/user/transactions/${id}/cancel`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to cancel transaction");
    }
    throw new Error("Network error occurred");
  }
};