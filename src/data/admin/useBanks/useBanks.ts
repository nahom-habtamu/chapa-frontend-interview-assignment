import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBank, deleteBank, getBanks, getBanksFromChapa, updateBank } from "./api";
import { mockBanks } from "./mock-data";
import { Bank } from "./types";

export const useBanks = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      try {
        // Try to get banks from Chapa API first
        const chapaResponse = await getBanksFromChapa();
        return chapaResponse.data || mockBanks;
      } catch (error) {
        // If Chapa API fails, try internal API
        try {
          return await getBanks();
        } catch (internalError) {
          // If both fail, return mock data
          console.warn("Both APIs failed, using mock data:", error, internalError);
          return mockBanks;
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createMutation = useMutation({
    mutationFn: createBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, bank }: { id: string; bank: Partial<Bank> }) =>
      updateBank(id, bank),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });

  return {
    banks: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    // Mutations
    createBank: createMutation.mutate,
    updateBank: updateMutation.mutate,
    deleteBank: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error?.message,
    updateError: updateMutation.error?.message,
    deleteError: deleteMutation.error?.message,
  };
};