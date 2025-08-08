export interface Bank {
  id: string;
  name: string;
  code: string;
  logo?: string;
  isActive?: boolean;
  supportedCurrencies?: string[];
  transferFee?: number;
  processingTime?: string;
}