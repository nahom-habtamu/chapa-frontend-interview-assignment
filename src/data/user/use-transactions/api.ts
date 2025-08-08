import { Transaction, WalletBalance } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTransactions = async (userId?: string): Promise<Transaction[]> => {
  await delay(600);
  const { mockTransactions } = await import("./mock-data");

  if (!userId) {
    return mockTransactions;
  }

  return mockTransactions.filter(transaction => transaction.userId === userId);
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
  await delay(600);
  const { mockTransactions } = await import("./mock-data");

  const transaction = mockTransactions.find(t => t.id === id);

  if (!transaction) {
    throw new Error("Transaction not found");
  }


  if (userId && transaction.userId !== userId) {
    throw new Error("You can only cancel your own transactions");
  }

  return { ...transaction, status: "cancelled" };
};