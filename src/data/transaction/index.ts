// Legacy exports - these are deprecated in favor of organized data layer
// Use /data/user/useTransactions for user transaction management

// Re-export for backward compatibility
export {
  mockTransactions, mockTransactionStats, mockWalletBalance, useTransaction, useTransactions, useTransactionStats, useWalletBalance
} from "../user/useTransactions";

export type {
  Transaction, TransactionFilters, TransactionStats, WalletBalance
} from "../user/useTransactions";

