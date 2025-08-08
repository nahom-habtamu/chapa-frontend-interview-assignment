"use client";

import { useAuth } from "../../../data/auth/use-auth";
import { AdminTransfers } from "../../../feature/admin/transfers";
import { Text } from "../../../ui/atoms/Text";

export default function TransfersPage() {
  const { isSuperAdmin } = useAuth();

  if (!isSuperAdmin()) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <Text variant="h3" className="text-red-600 mb-4">Access Denied</Text>
          <Text variant="body" className="text-gray-600">
            Only Super Administrators can access transfers.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <AdminTransfers />
    </div>
  );
}