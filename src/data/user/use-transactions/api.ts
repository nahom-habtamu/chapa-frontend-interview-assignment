import { Transaction, WalletBalance } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTransactions = async (): Promise<Transaction[]> => {
  await delay(600);
  const { mockTransactions } = await import("./mock-data");
  return mockTransactions;
};



export const getWalletBalance = async (): Promise<WalletBalance> => {
  await delay(400);
  const { mockWalletBalance } = await import("./mock-data");
  return mockWalletBalance;
};



export const cancelTransaction = async (id: string): Promise<Transaction> => {
  await delay(600);
  const { mockTransactions } = await import("./mock-data");
  const transaction = mockTransactions.find(t => t.id === id);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return { ...transaction, status: "cancelled" };
};