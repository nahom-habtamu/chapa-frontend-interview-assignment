import { Transfer } from "./types";

const TRANSFERS_STORAGE_KEY = "chapa_transfers";

const readTransfersFromStorage = (): Transfer[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(TRANSFERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to read transfers from storage:", error);
    return [];
  }
};

const writeTransfersToStorage = (transfers: Transfer[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TRANSFERS_STORAGE_KEY, JSON.stringify(transfers));
  } catch (error) {
    console.error("Failed to write transfers to storage:", error);
  }
};

export const addTransferToStorage = (transfer: Transfer): Transfer[] => {
  const existingTransfers = readTransfersFromStorage();
  const updatedTransfers = [transfer, ...existingTransfers];
  writeTransfersToStorage(updatedTransfers);
  return updatedTransfers;
};

export const updateTransferInStorage = (transferId: string, updates: Partial<Transfer>): Transfer[] => {
  const existingTransfers = readTransfersFromStorage();
  const transferIndex = existingTransfers.findIndex(t => t.id === transferId);

  if (transferIndex === -1) {
    return existingTransfers;
  }

  const updatedTransfer = {
    ...existingTransfers[transferIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  existingTransfers[transferIndex] = updatedTransfer;
  writeTransfersToStorage(existingTransfers);
  return existingTransfers;
};

export const getTransfersFromStorage = (): Transfer[] => {
  return readTransfersFromStorage();
};

export const clearTransfersFromStorage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TRANSFERS_STORAGE_KEY);
}; 