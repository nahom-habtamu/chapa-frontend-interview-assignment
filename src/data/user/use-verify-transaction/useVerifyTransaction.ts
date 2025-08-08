import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updateTransactionStatusByReference } from "../use-transactions/api";
import { TransactionStatus } from "../use-transactions/types";
import {
  verifyAndValidateTransaction,
  verifyTransaction
} from "./api";
import {
  quickVerifySchema,
  verifyTransactionSchema,
  type QuickVerifyData,
  type VerifyTransactionData
} from "./schema";
import { TransactionVerificationData } from "./types";

// Map Chapa API status to our TransactionStatus
const mapChapaStatusToTransactionStatus = (chapaStatus: string): TransactionStatus => {
  const status = chapaStatus.toLowerCase();

  if (status.includes('success')) return 'success';
  if (status.includes('failed') || status.includes('cancelled')) return 'failed';
  if (status.includes('pending')) return 'pending';
  if (status.includes('processing')) return 'processing';

  return 'pending';
};

export const useVerifyTransaction = () => {
  const queryClient = useQueryClient();

  const form = useForm<VerifyTransactionData>({
    resolver: zodResolver(verifyTransactionSchema),
    defaultValues: {
      txRef: "",
      expectedAmount: undefined,
      expectedCurrency: "ETB",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TransactionVerificationData) => {
      return await verifyAndValidateTransaction(data);
    },
    onSuccess: async (result, variables) => {
      if (result.isValid && result.transaction) {
        const mappedStatus = mapChapaStatusToTransactionStatus(result.transaction.status);
        await updateTransactionStatusByReference(variables.txRef, mappedStatus);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
      }
    },
    onError: (error: Error) => {
      console.error("Transaction verification error:", error.message);
    },
  });

  return {
    form,
    verifyTransaction: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    result: mutation.data,
    reset: () => {
      form.reset();
      mutation.reset();
    },
  };
};

export const useQuickVerify = () => {
  const queryClient = useQueryClient();

  const form = useForm<QuickVerifyData>({
    resolver: zodResolver(quickVerifySchema),
    defaultValues: {
      txRef: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuickVerifyData) => {
      const response = await verifyTransaction(data.txRef);
      return response;
    },
    onSuccess: async (response, variables) => {
      if (response.data && response.data.status) {
        const mappedStatus = mapChapaStatusToTransactionStatus(response.data.status);
        await updateTransactionStatusByReference(variables.txRef, mappedStatus);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
      }
    },
  });

  return {
    form,
    quickVerify: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: () => {
      form.reset();
      mutation.reset();
    },
  };
};

export const useTransactionVerification = (txRef: string, enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["transaction", "verify", txRef],
    queryFn: async () => {
      return await verifyTransaction(txRef);
    },
    enabled: !!txRef && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    verification: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};