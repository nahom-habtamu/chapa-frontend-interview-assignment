import axios from "axios";
import { ChapaInitializeRequest, ChapaInitializeResponse, ChapaVerifyResponse } from "./types";

// Chapa API configuration
const CHAPA_API_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY || "CHASECK_TEST-test-secret-key";

// Create axios instance with default config
const chapaApi = axios.create({
  baseURL: CHAPA_API_URL,
  headers: {
    "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// Initialize Payment - Real Chapa API call
export const initializePayment = async (data: ChapaInitializeRequest): Promise<ChapaInitializeResponse> => {
  try {
    const response = await chapaApi.post<ChapaInitializeResponse>("/transaction/initialize", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to initialize payment");
    }
    throw new Error("Network error occurred");
  }
};

// Verify Transaction - Real Chapa API call
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

// Get Banks - Real Chapa API call (bonus endpoint)
export const getBanks = async () => {
  try {
    const response = await chapaApi.get("/banks");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch banks");
    }
    throw new Error("Network error occurred");
  }
};

// Transfer Initialization - Real Chapa API call
export const initializeTransfer = async (data: string) => {
  try {
    const response = await chapaApi.post("/transfer", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to initialize transfer");
    }
    throw new Error("Network error occurred");
  }
};

// Transfer Status Check - Real Chapa API call
export const checkTransferStatus = async (transferId: string) => {
  try {
    const response = await chapaApi.get(`/transfer/${transferId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to check transfer status");
    }
    throw new Error("Network error occurred");
  }
};