import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockAdmins } from "../../common/mock-data";
import { AdminUser, PaginationParams } from "../../common/types";
import {
  createAdmin,
  deactivateAdmin,
  deleteAdmin,
  getAdmins,
  reactivateAdmin,
  updateAdmin
} from "./api";

export const useAdmins = (params?: PaginationParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "admins", params],
    queryFn: async () => {
      try {
        return await getAdmins(params);
      } catch (error) {
        console.warn("API failed, using mock data:", error);
        // Return mock data in the same format as API
        const adminUsers = mockAdmins as AdminUser[];
        return {
          data: adminUsers,
          total: adminUsers.length,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: Math.ceil(adminUsers.length / (params?.limit || 10)),
        };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, admin }: { id: string; admin: Partial<AdminUser> }) =>
      updateAdmin(id, admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: reactivateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });

  return {
    admins: query.data?.data || [],
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.page || 1,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,

    // Actions
    createAdmin: createMutation.mutate,
    updateAdmin: updateMutation.mutate,
    deactivateAdmin: deactivateMutation.mutate,
    reactivateAdmin: reactivateMutation.mutate,
    deleteAdmin: deleteMutation.mutate,

    // Action states
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