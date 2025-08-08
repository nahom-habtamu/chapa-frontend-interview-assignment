import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deactivateUser,
  deleteUser,
  getUsers,
  reactivateUser,
  toggleUserStatus
} from "./api";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers,
    staleTime: 2 * 60 * 1000,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: reactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return {
    users: query.data || [],
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

