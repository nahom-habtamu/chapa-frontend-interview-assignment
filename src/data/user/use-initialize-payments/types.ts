export interface ChapaInitializeRequest {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  description?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface ChapaInitializeResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
  // App-added field to track the tx_ref used for this initialization
  txRef?: string;
}

export interface PaymentInitializationData {
  amount: number;
  currency: string;
  description?: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  callbackUrl?: string;
  returnUrl?: string;
}

export interface PaymentSession {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "expired";
  checkoutUrl: string;
  createdAt: string;
  expiresAt: string;
}