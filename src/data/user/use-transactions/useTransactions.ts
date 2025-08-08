import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelTransaction,
  getTransactions,
  getWalletBalance
} from "./api";

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user-transactions"],
    queryFn: getTransactions,
    staleTime: 1 * 60 * 1000,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-transactions"] });
    },
  });

  return {
    transactions: query.data || [],
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



export const useWalletBalance = () => {
  const query = useQuery({
    queryKey: ["user-wallet-balance"],
    queryFn: getWalletBalance,
    staleTime: 30 * 1000,
  });

  return {
    balance: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

