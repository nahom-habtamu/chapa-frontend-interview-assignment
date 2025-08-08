export interface Transfer {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  accountNumber: string;
  bankCode: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  updated_at?: string;
  reference: string;
  reason?: string;
}

export interface TransferInitiateData {
  amount: number;
  currency: string;
  recipient: string;
  accountNumber: string;
  bankCode: string;
  reason?: string;
}

export interface TransferStatusResponse {
  transfer_id: string;
  status: string;
  amount: number;
  currency: string;
  recipient: string;
  created_at: string;
}