import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkTransferStatus, initiateTransfer } from "./api";
import { mockTransfers } from "./mock-data";
import { addTransferToStorage, getTransfersFromStorage } from "./storage";

export const useTransfers = () => {
  const query = useQuery({
    queryKey: ["transfers"],
    queryFn: async () => {
      const storedTransfers = getTransfersFromStorage();
      return [...storedTransfers, ...mockTransfers];
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    transfers: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useInitiateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateTransfer,
    onSuccess: (newTransfer) => {
      addTransferToStorage(newTransfer);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
};

export const useCheckTransferStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkTransferStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
};