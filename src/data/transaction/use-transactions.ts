import { useQuery } from "@tanstack/react-query";
import { mockTransactions, mockTransactionStats, mockWalletBalance } from "./mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get transactions hook
export const useTransactions = (filters?: {
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      await delay(500); // Simulate network delay

      let filteredTransactions = [...mockTransactions];

      // Apply filters
      if (filters?.status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
      }

      if (filters?.type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
      }

      // Sort by created_at descending (newest first)
      filteredTransactions.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Apply pagination
      const offset = filters?.offset || 0;
      const limit = filters?.limit || 10;
      const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

      return {
        transactions: paginatedTransactions,
        total: filteredTransactions.length,
        hasMore: offset + limit < filteredTransactions.length,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get recent transactions hook (for dashboard)
export const useRecentTransactions = (limit: number = 5) => {
  return useQuery({
    queryKey: ["recent-transactions", limit],
    queryFn: async () => {
      await delay(300);

      const recentTransactions = mockTransactions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);

      return recentTransactions;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get wallet balance hook
export const useWalletBalance = () => {
  return useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => {
      await delay(400);
      return mockWalletBalance;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get transaction statistics hook
export const useTransactionStats = () => {
  return useQuery({
    queryKey: ["transaction-stats"],
    queryFn: async () => {
      await delay(600);
      return mockTransactionStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single transaction hook
export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      await delay(300);

      const transaction = mockTransactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return transaction;
    },
    enabled: !!transactionId,
    staleTime: 30 * 1000, // 30 seconds
  });
};