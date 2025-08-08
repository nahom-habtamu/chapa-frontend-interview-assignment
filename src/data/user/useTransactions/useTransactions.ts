import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationParams } from "../../common/types";
import {
  cancelTransaction,
  getTransactionById,
  getTransactions,
  getTransactionStats,
  getWalletBalance
} from "./api";
import { mockTransactions, mockTransactionStats, mockWalletBalance } from "./mock-data";
import { TransactionFilters } from "./types";

export const useTransactions = (params?: PaginationParams & TransactionFilters) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user", "transactions", params],
    queryFn: async () => {
      try {
        return await getTransactions(params);
      } catch (error) {
        console.warn("API failed, using mock data:", error);
        // Return mock data in the same format as API
        const filteredTransactions = mockTransactions.filter(transaction => {
          if (params?.status && params.status.length > 0) {
            return params.status.includes(transaction.status);
          }
          if (params?.type && params.type.length > 0) {
            return params.type.includes(transaction.type);
          }
          if (params?.search) {
            const searchLower = params.search.toLowerCase();
            return (
              transaction.description.toLowerCase().includes(searchLower) ||
              transaction.reference.toLowerCase().includes(searchLower) ||
              transaction.recipient.toLowerCase().includes(searchLower)
            );
          }
          return true;
        });

        return {
          data: filteredTransactions,
          total: filteredTransactions.length,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: Math.ceil(filteredTransactions.length / (params?.limit || 10)),
        };
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const cancelMutation = useMutation({
    mutationFn: cancelTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "transactions"] });
    },
  });

  return {
    transactions: query.data?.data || [],
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.page || 1,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    // Actions
    cancelTransaction: cancelMutation.mutate,

    // Action states
    isCancelling: cancelMutation.isPending,
    cancelError: cancelMutation.error?.message,
  };
};

export const useTransaction = (id: string) => {
  const query = useQuery({
    queryKey: ["user", "transaction", id],
    queryFn: async () => {
      try {
        return await getTransactionById(id);
      } catch (error) {
        console.warn("API failed, using mock data:", error);
        return mockTransactions.find(t => t.id === id) || null;
      }
    },
    enabled: !!id,
  });

  return {
    transaction: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useWalletBalance = () => {
  const query = useQuery({
    queryKey: ["user", "wallet", "balance"],
    queryFn: async () => {
      try {
        return await getWalletBalance();
      } catch (error) {
        console.warn("API failed, using mock data:", error);
        return mockWalletBalance;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    balance: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useTransactionStats = () => {
  const query = useQuery({
    queryKey: ["user", "transactions", "stats"],
    queryFn: async () => {
      try {
        return await getTransactionStats();
      } catch (error) {
        console.warn("API failed, using mock data:", error);
        return mockTransactionStats;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};