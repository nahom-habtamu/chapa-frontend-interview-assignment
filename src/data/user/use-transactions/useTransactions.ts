import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelTransaction,
  getTransactions,
  getWalletBalance
} from "./api";

export const useTransactions = (userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => getTransactions(userId),
    staleTime: 1 * 60 * 1000,
    enabled: !!userId,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelTransaction(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
    },
  });

  return {
    transactions: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    cancelTransaction: cancelMutation.mutate,

    isCancelling: cancelMutation.isPending,
    cancelError: cancelMutation.error?.message,
  };
};



export const useWalletBalance = (userId?: string) => {
  const query = useQuery({
    queryKey: ["wallet", userId],
    queryFn: () => getWalletBalance(userId),
    staleTime: 30 * 1000,
    enabled: !!userId,
  });

  return {
    balance: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

