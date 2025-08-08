"use client";

import { useBanks } from "../../../data/admin";
import { BanksList } from "../../../ui/organisms/BanksList";

export default function BanksPage() {
  const { banks, loading, error } = useBanks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Banks Management</h1>
        <p className="text-gray-600 mt-2">
          View and manage supported banks for payment processing
        </p>
      </div>

      <BanksList 
        banks={banks} 
        loading={loading} 
        error={error}
      />
    </div>
  );
} 