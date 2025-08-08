import axios from "axios";
import { chapaApiClient } from "../../common/chapa-api-client";
import { ChapaInitializeRequest, ChapaInitializeResponse, PaymentInitializationData } from "./types";

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

    const response = await chapaApiClient.post<ChapaInitializeResponse>(
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

