import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkTransferStatus, getTransfers, initiateTransfer } from "./api";

export const useTransfers = () => {
  const query = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransfers,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
};

export const useCheckTransferStatus = () => {
  return useMutation({
    mutationFn: checkTransferStatus,
  });
};