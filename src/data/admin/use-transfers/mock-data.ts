import { Transfer } from "./types";

export const mockTransfers: Transfer[] = [
  {
    id: "TXN_001",
    amount: 5000,
    currency: "ETB",
    recipient: "John Doe",
    accountNumber: "1000123456",
    bankCode: "CBE",
    status: "completed",
    createdAt: "2024-02-20T10:30:00Z",
    reference: "REF_001",
    reason: "Salary payment"
  },
  {
    id: "TXN_002",
    amount: 2500,
    currency: "ETB",
    recipient: "Jane Smith",
    accountNumber: "2000654321",
    bankCode: "DASH",
    status: "processing",
    createdAt: "2024-02-21T14:15:00Z",
    reference: "REF_002",
    reason: "Contractor payment"
  },
  {
    id: "TXN_003",
    amount: 1000,
    currency: "ETB",
    recipient: "Bob Wilson",
    accountNumber: "3000987654",
    bankCode: "BOA",
    status: "failed",
    createdAt: "2024-02-21T16:45:00Z",
    reference: "REF_003",
    reason: "Refund payment"
  },
];