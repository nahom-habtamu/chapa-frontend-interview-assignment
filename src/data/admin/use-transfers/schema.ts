import { z } from "zod";

export const transferInitiateSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount cannot exceed 1,000,000"),
  currency: z
    .string()
    .regex(/^(ETB|USD)$/, "Currency must be ETB or USD"),
  recipient: z
    .string()
    .min(1, "Recipient name is required")
    .max(100, "Recipient name cannot exceed 100 characters"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(50, "Account number cannot exceed 50 characters"),
  bankId: z
    .string()
    .min(1, "Bank selection is required"),
  reason: z
    .string()
    .max(200, "Reason cannot exceed 200 characters")
    .optional(),
});

export type TransferInitiateFormData = z.infer<typeof transferInitiateSchema>; 