import axios from "axios";
import { chapaApiClient } from "../../common/chapa-api-client";
import { ChapaInitializeRequest, ChapaInitializeResponse, PaymentInitializationData } from "./types";

const generateTxRef = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `chapa_${timestamp}_${random}`;
};

const getOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL;
};

export const initializePayment = async (data: PaymentInitializationData): Promise<ChapaInitializeResponse> => {
  try {
    const txRef = generateTxRef();

    const origin = getOrigin();

    const chapaRequest: ChapaInitializeRequest = {
      amount: data.amount,
      currency: data.currency,
      email: data.customerEmail || "customer@example.com",
      first_name: data.customerFirstName || "Customer",
      last_name: data.customerLastName || "User",
      phone_number: data.customerPhone,
      tx_ref: txRef,
      callback_url: data.callbackUrl || `${origin}/api/payments/callback`,
      return_url: data.returnUrl || `${origin}/payment/success`,
      description: data.description || "Payment transaction",
      customization: {
        title: "Chapa Payment",
        description: data.description || "Complete your payment",
        logo: `${origin}/logo.png`,
      },
    };

    const response = await chapaApiClient.post<ChapaInitializeResponse>(
      "/transaction/initialize",
      chapaRequest
    );

    // Attach txRef so downstream can persist a pending transaction
    return { ...response.data, txRef };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to initialize payment");
    }
    throw new Error("Network error occurred");
  }
};

