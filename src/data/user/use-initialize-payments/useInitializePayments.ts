import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { initializePayment } from "./api";
import { initializePaymentSchema, quickPaymentSchema, type InitializePaymentData, type QuickPaymentData } from "./schema";
import { PaymentInitializationData } from "./types";

export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  const form = useForm<InitializePaymentData>({
    resolver: zodResolver(initializePaymentSchema),
    defaultValues: {
      amount: 0,
      currency: "ETB",
      description: "",
      customerFirstName: "",
      customerLastName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PaymentInitializationData) => {
      return await initializePayment(data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      if (response.data.checkout_url) {
        window.open(response.data.checkout_url, "_blank");
      }
    },
    onError: (error: Error) => {
      console.error("Payment initialization error:", error.message);
    },
  });

  return {
    form,
    initializePayment: mutation.mutate,
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

export const useQuickPayment = () => {
  const queryClient = useQueryClient();

  const form = useForm<QuickPaymentData>({
    resolver: zodResolver(quickPaymentSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuickPaymentData) => {
      const paymentData: PaymentInitializationData = {
        amount: data.amount,
        currency: "ETB",
        description: data.description,
        customerFirstName: "Quick",
        customerLastName: "Payment",
      };

      return await initializePayment(paymentData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      if (response.data.checkout_url) {
        window.open(response.data.checkout_url, "_blank");
      }
    },
  });

  return {
    form,
    quickPayment: mutation.mutate,
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