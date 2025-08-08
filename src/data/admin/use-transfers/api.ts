import axios from "axios";
import { chapaApiClient } from "../../common/chapa-api-client";
import { mockTransfers } from "./mock-data";
import { Transfer, TransferInitiateData, TransferStatusResponse } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateTransferRef = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `tran-${timestamp}-${random}`;
};

export const getTransfers = async (): Promise<Transfer[]> => {
  await delay(800);
  return mockTransfers;
};

export const initiateTransfer = async (data: TransferInitiateData): Promise<Transfer> => {
  try {
    const transferRef = generateTransferRef();
    const now = new Date().toISOString();

    // Chapa transfer endpoint via proxy (example paths; adjust to real ones if needed)
    await chapaApiClient.post("/transfers", {
      amount: data.amount,
      currency: data.currency,
      recipient: data.recipient,
      account_number: data.accountNumber,
      bank_code: data.bankCode,
      reason: data.reason,
      reference: transferRef,
    });

    // Create a complete transfer object
    const newTransfer: Transfer = {
      id: `TXN_${Date.now()}`,
      amount: data.amount,
      currency: data.currency,
      recipient: data.recipient,
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
      status: "pending",
      createdAt: now,
      updated_at: now,
      reference: transferRef,
      reason: data.reason,
    };

    // Return the complete transfer object
    return newTransfer;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to initiate transfer");
    }
    throw new Error("Network error occurred");
  }
};

export const checkTransferStatus = async (reference: string): Promise<TransferStatusResponse> => {
  try {
    const response = await chapaApiClient.get(`/transfers/verify/${reference}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to check transfer status");
    }
    throw new Error("Network error occurred");
  }
};