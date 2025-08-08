import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBank, deleteBank, getBanks, getBanksFromChapa, updateBank } from "./api";
import { mockBanks } from "./mock-data";
import { Bank } from "./types";

export const useBanks = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-banks"],
    queryFn: async () => {
      try {
        const chapaResponse = await getBanksFromChapa();
        return chapaResponse.data || mockBanks;
      } catch (error) {
        try {
          return await getBanks();
        } catch (internalError) {
          console.warn("Both APIs failed, using mock data:", error, internalError);
          return mockBanks;
        }
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banks"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, bank }: { id: string; bank: Partial<Bank> }) =>
      updateBank(id, bank),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banks"] });
    },
  });

  return {
    banks: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    createBank: createMutation.mutate,
    updateBank: updateMutation.mutate,
    deleteBank: deleteMutation.mutate,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error?.message,
    updateError: updateMutation.error?.message,
    deleteError: deleteMutation.error?.message,
  };
};