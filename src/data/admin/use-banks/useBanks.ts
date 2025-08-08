import { useQuery } from "@tanstack/react-query";
import { getBanksFromChapa } from "./api";

export const useBanks = () => {
  const query = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      try {
        const chapaResponse = await getBanksFromChapa();
        return chapaResponse.data;
      } catch (error) {
        console.warn("Failed to fetch banks from Chapa:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    banks: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};