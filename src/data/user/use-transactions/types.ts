export type TransactionType = "payment" | "payout" | "transfer" | "refund";
export type TransactionStatus = "pending" | "success" | "failed" | "cancelled" | "processing";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  description: string;
  reference: string;
  recipient: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface WalletBalance {
  currency: string;
  available: number;
  pending: number;
  total: number;
}

export interface TransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalVolume: number;
  averageTransaction: number;
}

export interface TransactionFilters {
  status?: TransactionStatus[];
  type?: TransactionType[];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}