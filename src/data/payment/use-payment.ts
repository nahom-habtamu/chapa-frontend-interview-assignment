import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { getBanks, initializePayment, verifyTransaction } from "./chapa-api";
import { paymentInitSchema, verifyTransactionSchema, type PaymentInitFormData, type VerifyTransactionFormData } from "./types";

// Initialize Payment Hook
export const useInitializePayment = () => {
  const form = useForm<PaymentInitFormData>({
    resolver: zodResolver(paymentInitSchema),
    defaultValues: {
      amount: "",
      currency: "ETB",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PaymentInitFormData) => {
      const txRef = `chapa-tx-${uuidv4()}`;

      const chapaRequest = {
        amount: data.amount,
        currency: data.currency,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        tx_ref: txRef,
        callback_url: `${window.location.origin}/payment/callback`,
        return_url: `${window.location.origin}/payment/success`,
        customization: {
          title: "Chapa Pay",
          description: data.description || "Payment transaction",
          logo: "https://your-logo-url.com/logo.png",
        },
      };

      return initializePayment(chapaRequest);
    },
    onSuccess: (response) => {
      // Redirect to Chapa checkout page
      if (response.status === "success" && response.data.checkout_url) {
        window.open(response.data.checkout_url, "_blank");
      }
    },
  });

  const handleInitializePayment = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    handleInitializePayment,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};

// Verify Transaction Hook
export const useVerifyTransaction = () => {
  const form = useForm<VerifyTransactionFormData>({
    resolver: zodResolver(verifyTransactionSchema),
    defaultValues: {
      tx_ref: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: VerifyTransactionFormData) => {
      return verifyTransaction(data.tx_ref);
    },
  });

  const handleVerifyTransaction = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    handleVerifyTransaction,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};

// Get Banks Hook
export const useBanks = () => {
  return useQuery({
    queryKey: ["banks"],
    queryFn: getBanks,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};