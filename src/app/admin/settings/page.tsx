"use client";

import { useBanks } from "../../../data/payment";
import { Text } from "../../../ui/atoms/Text";
import { BanksList } from "../../../ui/organisms";

export default function AdminSettings() {
  const { banks, loading, error } = useBanks();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Text variant="h2" className="text-gray-900 font-bold">
          Admin Settings
        </Text>
        <Text variant="body" className="text-gray-600 mt-2">
          Configure system settings and payment integrations
        </Text>
      </div>

      {/* Banks Configuration */}
      <div className="space-y-8">
        <BanksList 
          banks={banks}
          loading={loading}
          error={error}
        />
        
        {/* Placeholder for additional settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <Text variant="h6" className="font-semibold text-gray-900 mb-4">
            System Configuration
          </Text>
          <Text variant="body" className="text-gray-500">
            Additional system settings will be available here in future releases.
          </Text>
        </div>
      </div>
    </div>
  );
}