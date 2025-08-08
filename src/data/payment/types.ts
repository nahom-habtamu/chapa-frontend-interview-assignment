import { z } from "zod";

export interface ChapaInitializeRequest {
  amount: string;
  currency: "ETB" | "USD";
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  tx_ref: string;
  callback_url?: string;
  return_url?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface ChapaInitializeResponse {
  message: string;
  status: "success" | "failed";
  data: {
    checkout_url: string;
  };
}

export interface ChapaVerifyResponse {
  message: string;
  status: "success" | "failed";
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: string;
    charge: string;
    mode: "test" | "live";
    method: string;
    type: string;
    status: "success" | "failed" | "pending";
    reference: string;
    tx_ref: string;
    customization: {
      title?: string;
      description?: string;
      logo?: string;
    };
    meta: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  };
}

// Application types
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "cancelled" | "processing";
  type: "payment" | "payout" | "refund" | "transfer";
  description: string;
  reference: string;
  recipient: string;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  currency: string;
  available: number;
  pending: number;
  total: number;
}

export const paymentInitSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  currency: z.enum(["ETB", "USD"], {
    message: "Please select a currency",
  }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  phone_number: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),
  description: z.string().optional(),
});

export const verifyTransactionSchema = z.object({
  tx_ref: z.string().min(1, "Transaction reference is required"),
});

export type PaymentInitFormData = z.infer<typeof paymentInitSchema>;
export type VerifyTransactionFormData = z.infer<typeof verifyTransactionSchema>;