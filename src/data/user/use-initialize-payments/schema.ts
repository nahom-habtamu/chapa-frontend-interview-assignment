import { z } from "zod";

export const initializePaymentSchema = z.object({
  amount: z
    .coerce.number()
    .min(1, "Amount must be greater than 0")
    .max(1000000, "Amount exceeds maximum limit"),
  currency: z
    .string()
    .regex(/^(ETB|USD|EUR)$/, "Invalid currency. Supported: ETB, USD, EUR"),
  description: z
    .union([
      z.string().min(1, "Description is required").max(255, "Description is too long"),
      z.literal("")
    ])
    .optional(),
  customerEmail: z
    .union([
      z.string().email("Invalid email address"),
      z.literal("")
    ])
    .optional(),
  customerFirstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  customerLastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  customerPhone: z
    .union([
      z.string().regex(/^\+251[0-9]{9}$/, "Invalid phone number format. Use +251XXXXXXXXX"),
      z.literal("")
    ])
    .optional(),
  callbackUrl: z
    .union([
      z.string().url("Invalid callback URL"),
      z.literal("")
    ])
    .optional(),
  returnUrl: z
    .union([
      z.string().url("Invalid return URL"),
      z.literal("")
    ])
    .optional(),
});

export type InitializePaymentData = z.infer<typeof initializePaymentSchema>;

export const quickPaymentSchema = z.object({
  amount: z
    .number()
    .min(1, "Amount must be greater than 0")
    .max(10000, "Amount exceeds quick payment limit"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description is too long"),
});

export type QuickPaymentData = z.infer<typeof quickPaymentSchema>;