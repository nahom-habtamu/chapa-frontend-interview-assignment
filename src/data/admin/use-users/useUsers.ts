import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BaseUser } from "../../common/types";
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
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 2 * 60 * 1000,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users"], (oldData: BaseUser[]) => {
        if (!oldData) return oldData;
        return oldData.map((user: BaseUser) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: reactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    toggleUserStatus: toggleStatusMutation.mutate,
    deactivateUser: deactivateMutation.mutate,
    reactivateUser: reactivateMutation.mutate,
    deleteUser: deleteMutation.mutate,

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

