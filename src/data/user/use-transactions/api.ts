import { Transaction, WalletBalance, type TransactionStatus } from "./types";

const STORAGE_KEY = "chapa_transactions";

function readTransactionsFromStorage(): Transaction[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

function writeTransactionsToStorage(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

async function ensureSeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const { mockTransactions } = await import("./mock-data");
    writeTransactionsToStorage(mockTransactions);
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTransactions = async (userId?: string): Promise<Transaction[]> => {
  await delay(300);
  await ensureSeeded();
  const all = readTransactionsFromStorage();
  if (!userId) return all;
  return all.filter((t) => t.userId === userId);
};



export const getWalletBalance = async (userId?: string): Promise<WalletBalance> => {
  await delay(400);


  const userWalletBalances: Record<string, WalletBalance> = {
    "1": { currency: "ETB", available: 1250.75, pending: 75.50, total: 1326.25 },
    "2": { currency: "ETB", available: 850.00, pending: 300.00, total: 1150.00 },
    "4": { currency: "ETB", available: 2100.00, pending: 85.25, total: 2185.25 },
    "5": { currency: "ETB", available: 450.00, pending: 1200.00, total: 1650.00 },
    "7": { currency: "ETB", available: 3200.00, pending: 0, total: 3200.00 },
    "8": { currency: "ETB", available: 1800.00, pending: 0, total: 1800.00 },
  };

  if (userId && userWalletBalances[userId]) {
    return userWalletBalances[userId];
  }


  return { currency: "ETB", available: 1000.00, pending: 0, total: 1000.00 };
};



export const cancelTransaction = async (id: string, userId?: string): Promise<Transaction> => {
  await delay(300);
  await ensureSeeded();
  const all = readTransactionsFromStorage();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Transaction not found");
  const transaction = all[idx];
  if (userId && transaction.userId !== userId) {
    throw new Error("You can only cancel your own transactions");
  }
  const updated: Transaction = { ...transaction, status: "cancelled", updated_at: new Date().toISOString() };
  all[idx] = updated;
  writeTransactionsToStorage(all);
  return updated;
};

export interface AppendTransactionParams {
  userId: string;
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  recipient?: string;
  type?: Transaction["type"]; // defaults to 'payment'
  status?: Transaction["status"]; // defaults to 'pending'
}

export const appendTransaction = async (params: AppendTransactionParams): Promise<Transaction> => {
  await ensureSeeded();
  const now = new Date().toISOString();
  const all = readTransactionsFromStorage();
  const newTx: Transaction = {
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
  const updated = [newTx, ...all];
  writeTransactionsToStorage(updated);
  return newTx;
};

export const updateTransactionStatusByReference = async (
  reference: string,
  status: TransactionStatus
): Promise<Transaction | null> => {
  await ensureSeeded();
  const all = readTransactionsFromStorage();
  const idx = all.findIndex((t) => t.reference === reference);
  if (idx === -1) {
    return null;
  }

  const updated: Transaction = {
    ...all[idx],
    status,
    updated_at: new Date().toISOString(),
  };
  all[idx] = updated;
  writeTransactionsToStorage(all);
  return updated;
};