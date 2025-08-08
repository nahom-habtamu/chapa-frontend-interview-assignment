import axios from "axios";
import { apiClient } from "../../common/api-client";
import { mockTransfers } from "./mock-data";
import { Transfer, TransferInitiateData, TransferStatusResponse } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTransfers = async (): Promise<Transfer[]> => {
  await delay(800);
  return mockTransfers;
};

export const initiateTransfer = async (data: TransferInitiateData): Promise<Transfer> => {
  try {
    const response = await apiClient.post("/transfer", {
      amount: data.amount.toString(),
      currency: data.currency,
      recipient: data.recipient,
      account_number: data.accountNumber,
      bank_code: data.bankCode,
      reason: data.reason,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to initiate transfer");
    }
    throw new Error("Network error occurred");
  }
};

export const checkTransferStatus = async (transferId: string): Promise<TransferStatusResponse> => {
  try {
    const response = await apiClient.get(`/transfer/${transferId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to check transfer status");
    }
    throw new Error("Network error occurred");
  }
};