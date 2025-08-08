import { useState } from "react";
import { updateTransferInStorage } from "./storage";
import { type TransferStatusResponse } from "./types";
import { useCheckTransferStatus } from "./useTransfers";

export const useTransferVerification = () => {
  const [verifyingReference, setVerifyingReference] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<TransferStatusResponse | null>(null);
  const statusMutation = useCheckTransferStatus();

  const verifyTransfer = async (reference: string) => {
    setVerifyingReference(reference);
    try {
      const result = await statusMutation.mutateAsync(reference);
      setVerificationResult(result);

      // Update the transfer status in localStorage
      if (result && result.transfer_id) {
        updateTransferInStorage(result.transfer_id, {
          status: result.status as "pending" | "processing" | "completed" | "failed",
        });
      }

      return result;
    } catch (error) {
      console.error("Transfer verification failed:", error);
      setVerificationResult(null);
      throw error;
    } finally {
      setVerifyingReference("");
    }
  };

  const clearVerificationResult = () => {
    setVerificationResult(null);
  };

  return {
    verifyTransfer,
    verifyingReference,
    verificationResult,
    clearVerificationResult,
    isLoading: statusMutation.isPending,
    error: statusMutation.error?.message,
    isError: statusMutation.isError,
  };
}; 