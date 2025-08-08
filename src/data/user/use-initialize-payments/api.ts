import axios from "axios";
import { ChapaInitializeRequest, ChapaInitializeResponse, PaymentInitializationData } from "./types";

const CHAPA_API_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.NEXT_PUBLIC_CHAPA_SECRET_KEY || "CHASECK_TEST-test-secret-key";

const chapaApi = axios.create({
  baseURL: CHAPA_API_URL,
  headers: {
    "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const generateTxRef = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `chapa_${timestamp}_${random}`;
};

export const initializePayment = async (data: PaymentInitializationData): Promise<ChapaInitializeResponse> => {
  try {
    const txRef = generateTxRef();

    const chapaRequest: ChapaInitializeRequest = {
      amount: data.amount,
      currency: data.currency,
      email: data.customerEmail || "customer@example.com",
      first_name: data.customerFirstName || "Customer",
      last_name: data.customerLastName || "User",
      phone_number: data.customerPhone,
      tx_ref: txRef,
      callback_url: data.callbackUrl || `${window.location.origin}/api/payments/callback`,
      return_url: data.returnUrl || `${window.location.origin}/payment/success`,
      description: data.description || "Payment transaction",
      customization: {
        title: "Chapa Payment",
        description: data.description || "Complete your payment",
        logo: `${window.location.origin}/logo.png`,
      },
    };

    const response = await chapaApi.post<ChapaInitializeResponse>(
      "/transaction/initialize",
      chapaRequest
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to initialize payment");
    }
    throw new Error("Network error occurred");
  }
};

export const mockInitializePayment = async (data: PaymentInitializationData): Promise<ChapaInitializeResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const txRef = generateTxRef();

  if (data.amount < 0) {
    throw new Error("Invalid amount");
  }

  if (data.amount > 100000) {
    throw new Error("Amount exceeds maximum limit");
  }

  return {
    message: "Payment initialized successfully",
    status: "success",
    data: {
      checkout_url: `https://checkout.chapa.co/checkout/payment/${txRef}`,
    },
  };
};