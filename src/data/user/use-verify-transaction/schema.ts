import { z } from "zod";

export const verifyTransactionSchema = z.object({
  txRef: z
    .string()
    .min(1, "Transaction reference is required")
    .regex(/^chapa_\d+_[a-z0-9]+$/, "Invalid transaction reference format"),
  expectedAmount: z
    .number()
    .min(0, "Expected amount must be non-negative")
    .optional(),
  expectedCurrency: z
    .string()
    .regex(/^(ETB|USD|EUR)$/, "Invalid currency")
    .optional(),
});

export type VerifyTransactionData = z.infer<typeof verifyTransactionSchema>;

export const quickVerifySchema = z.object({
  txRef: z
    .string()
    .min(1, "Transaction reference is required"),
});

export type QuickVerifyData = z.infer<typeof quickVerifySchema>;