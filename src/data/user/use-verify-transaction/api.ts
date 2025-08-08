import axios from "axios";
import { ChapaVerifyResponse, TransactionVerificationData, VerificationResult } from "./types";

const CHAPA_API_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY || "CHASECK_TEST-test-secret-key";

const chapaApi = axios.create({
  baseURL: CHAPA_API_URL,
  headers: {
    "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const verifyTransaction = async (txRef: string): Promise<ChapaVerifyResponse> => {
  try {
    const response = await chapaApi.get<ChapaVerifyResponse>(`/transaction/verify/${txRef}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to verify transaction");
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

export const mockVerifyTransaction = async (txRef: string): Promise<ChapaVerifyResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!txRef.startsWith("chapa_")) {
    throw new Error("Invalid transaction reference format");
  }

  const mockStatuses = ["success", "pending", "failed"];
  const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

  if (randomStatus === "failed") {
    throw new Error("Transaction not found or failed");
  }

  return {
    message: "Transaction verified successfully",
    status: "success",
    data: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      currency: "ETB",
      amount: 100.00,
      charge: 2.50,
      mode: "test",
      method: "mobile_money",
      type: "payment",
      status: randomStatus,
      reference: `CHA_${Date.now()}`,
      tx_ref: txRef,
      customization: {
        title: "Test Payment",
        description: "Test transaction",
        logo: "https://example.com/logo.png",
      },
      meta: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
};