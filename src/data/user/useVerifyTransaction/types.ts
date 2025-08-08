export interface ChapaVerifyResponse {
  message: string;
  status: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: number;
    charge: number;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: {
      title: string;
      description: string;
      logo: string;
    };
    meta: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  };
}

export interface VerificationResult {
  isValid: boolean;
  transaction: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    customerName: string;
    customerEmail: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  error?: string;
}

export interface TransactionVerificationData {
  txRef: string;
  expectedAmount?: number;
  expectedCurrency?: string;
}