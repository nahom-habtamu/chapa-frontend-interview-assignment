import { Transaction, WalletBalance, type TransactionStatus } from "./types";

const STORAGE_KEY = "chapa_transactions";
const DELAY = 300;

const MOCK_WALLET_BALANCES: Record<string, WalletBalance> = {
  "1": { currency: "ETB", available: 1250.75, pending: 75.50, total: 1326.25 },
  "2": { currency: "ETB", available: 850.00, pending: 300.00, total: 1150.00 },
  "4": { currency: "ETB", available: 2100.00, pending: 85.25, total: 2185.25 },
  "5": { currency: "ETB", available: 450.00, pending: 1200.00, total: 1650.00 },
  "7": { currency: "ETB", available: 3200.00, pending: 0, total: 3200.00 },
  "8": { currency: "ETB", available: 1800.00, pending: 0, total: 1800.00 },
};

const DEFAULT_WALLET_BALANCE: WalletBalance = {
  currency: "ETB",
  available: 1000.00,
  pending: 0,
  total: 1000.00,
};


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const readTransactionsFromStorage = (): Transaction[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Transaction[] : [];
  } catch {
    return [];
  }
};

const writeTransactionsToStorage = (transactions: Transaction[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

const ensureSeeded = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const { mockTransactions } = await import("./mock-data");
    writeTransactionsToStorage(mockTransactions);
  }
};

export const getTransactions = async (userId?: string): Promise<Transaction[]> => {
  await delay(DELAY);
  await ensureSeeded();

  const allTransactions = readTransactionsFromStorage();
  return userId ? allTransactions.filter(t => t.userId === userId) : allTransactions;
};

export const getWalletBalance = async (userId?: string): Promise<WalletBalance> => {
  await delay(DELAY);

  if (userId && MOCK_WALLET_BALANCES[userId]) {
    return MOCK_WALLET_BALANCES[userId];
  }

  return DEFAULT_WALLET_BALANCE;
};

export const cancelTransaction = async (id: string, userId?: string): Promise<Transaction> => {
  await delay(DELAY);
  await ensureSeeded();

  const allTransactions = readTransactionsFromStorage();
  const transactionIndex = allTransactions.findIndex(t => t.id === id);

  if (transactionIndex === -1) {
    throw new Error("Transaction not found");
  }

  const transaction = allTransactions[transactionIndex];

  if (userId && transaction.userId !== userId) {
    throw new Error("You can only cancel your own transactions");
  }

  const updatedTransaction: Transaction = {
    ...transaction,
    status: "cancelled",
    updated_at: new Date().toISOString(),
  };

  allTransactions[transactionIndex] = updatedTransaction;
  writeTransactionsToStorage(allTransactions);

  return updatedTransaction;
};


export interface AppendTransactionParams {
  userId: string;
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  recipient?: string;
  type?: Transaction["type"];
  status?: Transaction["status"];
}

export const appendTransaction = async (params: AppendTransactionParams): Promise<Transaction> => {
  await ensureSeeded();

  const now = new Date().toISOString();
  const allTransactions = readTransactionsFromStorage();

  const newTransaction: Transaction = {
    id: Date.now().toString(),
    userId: params.userId,
    amount: params.amount,
    currency: params.currency,
    status: params.status ?? "pending",
    type: params.type ?? "payment",
    description: params.description ?? "Payment transaction",
    reference: params.reference,
    recipient: params.recipient ?? "Merchant",
    created_at: now,
    updated_at: now,
  };

  const updatedTransactions = [newTransaction, ...allTransactions];
  writeTransactionsToStorage(updatedTransactions);

  return newTransaction;
};

export const updateTransactionStatusByReference = async (
  reference: string,
  status: TransactionStatus
): Promise<Transaction | null> => {
  await ensureSeeded();

  const allTransactions = readTransactionsFromStorage();
  const transactionIndex = allTransactions.findIndex(t => t.reference === reference);

  if (transactionIndex === -1) {
    return null;
  }

  const updatedTransaction: Transaction = {
    ...allTransactions[transactionIndex],
    status,
    updated_at: new Date().toISOString(),
  };

  allTransactions[transactionIndex] = updatedTransaction;
  writeTransactionsToStorage(allTransactions);

  return updatedTransaction;
};