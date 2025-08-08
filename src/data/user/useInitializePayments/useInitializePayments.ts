import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { initializePayment, mockInitializePayment } from "./api";
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
      // Try real API first, fallback to mock
      try {
        return await initializePayment(data);
      } catch (error) {
        console.warn("Real API failed, using mock:", error);
        return await mockInitializePayment(data);
      }
    },
    onSuccess: (response) => {
      // Invalidate transactions to refetch latest data
      queryClient.invalidateQueries({ queryKey: ["user", "transactions"] });

      // Redirect to checkout URL
      if (response.data.checkout_url) {
        window.open(response.data.checkout_url, "_blank");
      }
    },
    onError: (error: Error) => {
      console.error("Payment initialization error:", error.message);
    },
  });

  const handleInitializePayment = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    handleInitializePayment,
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

      try {
        return await initializePayment(paymentData);
      } catch (error) {
        console.warn("Real API failed, using mock:", error);
        return await mockInitializePayment(paymentData);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user", "transactions"] });

      if (response.data.checkout_url) {
        window.open(response.data.checkout_url, "_blank");
      }
    },
  });

  const handleQuickPayment = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    handleQuickPayment,
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