import axios from "axios";
import { chapaApiClient } from "../../common/chapa-api-client";
import { ChapaVerifyResponse, TransactionVerificationData, VerificationResult } from "./types";

export const verifyTransaction = async (txRef: string): Promise<ChapaVerifyResponse> => {
  try {
    const response = await chapaApiClient.get<ChapaVerifyResponse>(`/transaction/verify/${txRef}`);

    // Check if the response indicates success
    if (response.data?.status === "success" && response.data?.data) {
      return response.data;
    } else {
      throw new Error("Transaction not found or invalid reference");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle nested error messages
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.response?.data?.data?.message ||
        "Failed to verify transaction";
      throw new Error(errorMessage);
    }
    throw new Error("Network error occurred");
  }
};

export const verifyAndValidateTransaction = async (
  data: TransactionVerificationData
): Promise<VerificationResult> => {
  try {
    const response = await verifyTransaction(data.txRef);

    if (response.status !== "success") {
      return {
        isValid: false,
        transaction: null,
        error: "Transaction verification failed",
      };
    }

    const transactionData = response.data;

    if (data.expectedAmount && transactionData.amount !== data.expectedAmount) {
      return {
        isValid: false,
        transaction: null,
        error: `Amount mismatch. Expected: ${data.expectedAmount}, Actual: ${transactionData.amount}`,
      };
    }

    if (data.expectedCurrency && transactionData.currency !== data.expectedCurrency) {
      return {
        isValid: false,
        transaction: null,
        error: `Currency mismatch. Expected: ${data.expectedCurrency}, Actual: ${transactionData.currency}`,
      };
    }

    return {
      isValid: true,
      transaction: {
        id: transactionData.tx_ref,
        reference: transactionData.reference,
        amount: transactionData.amount,
        currency: transactionData.currency,
        status: transactionData.status,
        customerName: `${transactionData.first_name} ${transactionData.last_name}`,
        customerEmail: transactionData.email,
        createdAt: transactionData.created_at,
        updatedAt: transactionData.updated_at,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      transaction: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

