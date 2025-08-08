import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBanks } from "../use-banks";
import { transferInitiateSchema, type TransferInitiateFormData } from "./schema";
import { useInitiateTransfer } from "./useTransfers";

export const useTransferInitiation = () => {
  const { banks, loading: banksLoading } = useBanks();
  const initiateMutation = useInitiateTransfer();

  const form = useForm<TransferInitiateFormData>({
    resolver: zodResolver(transferInitiateSchema),
    defaultValues: {
      amount: 0,
      currency: "ETB",
      recipient: "",
      accountNumber: "",
      bankId: "",
      reason: "",
    },
  });

  const onSubmit = async (data: TransferInitiateFormData) => {
    // Find the selected bank to get its ID
    const selectedBank = banks.find(bank => bank.id.toString() === data.bankId);
    if (!selectedBank) {
      throw new Error("Selected bank not found");
    }

    const result = await initiateMutation.mutateAsync({
      amount: data.amount,
      currency: data.currency,
      recipient: data.recipient,
      accountNumber: data.accountNumber,
      bankCode: selectedBank.id.toString(),
      reason: data.reason,
    });

    return result;
  };

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    banks,
    banksLoading,
    initiateTransfer: async (data: TransferInitiateFormData) => {
      return await onSubmit(data);
    },
    isLoading: initiateMutation.isPending,
    error: initiateMutation.error?.message,
    isError: initiateMutation.isError,
    isSuccess: initiateMutation.isSuccess,
    resetForm,
  };
}; 