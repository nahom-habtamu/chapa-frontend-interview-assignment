export interface Bank {
  id: number;
  slug: string;
  swift: string;
  name: string;
  acct_length: number;
  country_id: number;
  is_mobilemoney: number | null;
  failed_if_error: number | null;
  is_active: number;
  is_rtgs: number;
  real_bank: number;
  active: number;
  is_24hrs: number | null;
  created_at: string;
  updated_at: string;
  can_process_payouts: number;
  can_process_payments: number;
  is_payout: number | null;
  is_reporting: number | null;
  is_payin: number | null;
  logo: string | null;
  fallback_price: number | null;
  custom_price: number | null;
  currency: string;
}

export interface BanksResponse {
  message: string;
  data: Bank[];
}