import { useEffect, useState } from "react";
import { getBanks } from "./chapa-api";

export interface Bank {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export const useBanks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock banks data as fallback
  const mockBanks: Bank[] = [
    { id: "1", name: "Commercial Bank of Ethiopia", code: "CBE" },
    { id: "2", name: "Dashen Bank", code: "DASH" },
    { id: "3", name: "Bank of Abyssinia", code: "BOA" },
    { id: "4", name: "Wegagen Bank", code: "WEG" },
    { id: "5", name: "United Bank", code: "UB" },
    { id: "6", name: "Nib International Bank", code: "NIB" },
    { id: "7", name: "Cooperative Bank of Oromia", code: "CBO" },
    { id: "8", name: "Lion International Bank", code: "LIB" },
  ];

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBanks();
      setBanks(response.data || mockBanks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch banks");
      // Use mock data as fallback
      setBanks(mockBanks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return {
    banks,
    loading,
    error,
    refetch: fetchBanks,
  };
};