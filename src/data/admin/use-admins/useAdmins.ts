import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminUser } from "../../common/types";
import {
  createAdmin,
  deactivateAdmin,
  deleteAdmin,
  getAdmins,
  reactivateAdmin,
  updateAdmin
} from "./api";

export const useAdmins = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
    staleTime: 2 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, admin }: { id: string; admin: Partial<AdminUser> }) =>
      updateAdmin(id, admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: reactivateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  return {
    admins: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    createAdmin: createMutation.mutate,
    updateAdmin: updateMutation.mutate,
    deactivateAdmin: deactivateMutation.mutate,
    reactivateAdmin: reactivateMutation.mutate,
    deleteAdmin: deleteMutation.mutate,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    isReactivating: reactivateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    createError: createMutation.error?.message,
    updateError: updateMutation.error?.message,
    deactivateError: deactivateMutation.error?.message,
    reactivateError: reactivateMutation.error?.message,
    deleteError: deleteMutation.error?.message,
  };
};