import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockRegularUsers } from "../../common/mock-data";
import { PaginationParams } from "../../common/types";
import {
  deactivateUser,
  deleteUser,
  getUserById,
  getUsers,
  reactivateUser,
  toggleUserStatus
} from "./api";

export const useUsers = (params?: PaginationParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      try {
        return await getUsers(params);
      } catch (error) {
        console.warn("API failed, using mock data:", error);
        // Return mock data in the same format as API
        return {
          data: mockRegularUsers,
          total: mockRegularUsers.length,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: Math.ceil(mockRegularUsers.length / (params?.limit || 10)),
        };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: reactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return {
    users: query.data?.data || [],
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.page || 1,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    // Actions
    toggleUserStatus: toggleStatusMutation.mutate,
    deactivateUser: deactivateMutation.mutate,
    reactivateUser: reactivateMutation.mutate,
    deleteUser: deleteMutation.mutate,

    // Action states
    isTogglingStatus: toggleStatusMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    isReactivating: reactivateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    toggleError: toggleStatusMutation.error?.message,
    deactivateError: deactivateMutation.error?.message,
    reactivateError: reactivateMutation.error?.message,
    deleteError: deleteMutation.error?.message,
  };
};

export const useUser = (id: string) => {
  const query = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

  return {
    user: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};