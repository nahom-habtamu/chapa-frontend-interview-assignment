import React from "react";
import { Bank } from "../../data/admin/use-banks/types";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icons";
import { Text } from "../atoms/Text";

interface BanksListProps {
  banks: Bank[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export const BanksList: React.FC<BanksListProps> = ({ 
  banks, 
  loading = false, 
  error = null, 
  className = "" 
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && banks.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 ${className}`}>
        <div className="text-center">
          <Icon name="alertCircle" size="lg" className="text-red-400 mx-auto mb-4" />
          <Text variant="h6" className="text-gray-500 mb-2">
            Failed to load banks
          </Text>
          <Text variant="caption" className="text-gray-400">
            {error}
          </Text>
        </div>
      </div>
    );
  }

  const getBankTypeColor = (bank: Bank) => {
    if (bank.is_mobilemoney === 1) return "from-purple-500 to-purple-600";
    if (bank.real_bank === 1) return "from-blue-500 to-blue-600";
    return "from-gray-500 to-gray-600";
  };

  const getBankTypeLabel = (bank: Bank) => {
    if (bank.is_mobilemoney === 1) return "Mobile Money";
    if (bank.real_bank === 1) return "Bank";
    return "Other";
  };

  const getStatusBadge = (bank: Bank) => {
    if (bank.is_active === 1 && bank.active === 1) {
      return <Badge variant="success" size="sm">Active</Badge>;
    }
    return <Badge variant="failed" size="sm">Inactive</Badge>;
  };

  const getServicesBadges = (bank: Bank) => {
    const badges = [];
    if (bank.can_process_payments === 1) {
      badges.push(<Badge key="payments" variant="default" size="sm">Payments</Badge>);
    }
    if (bank.can_process_payouts === 1) {
      badges.push(<Badge key="payouts" variant="default" size="sm">Payouts</Badge>);
    }
    if (bank.is_24hrs === 1) {
      badges.push(<Badge key="24hrs" variant="primary" size="sm">24/7</Badge>);
    }
    return badges;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200/60">
        <Text variant="h6" className="font-semibold text-gray-900">
          Supported Banks & Payment Methods
        </Text>
        <Text variant="caption" className="text-gray-500 mt-1">
          {banks.length} banks and payment methods available for processing
        </Text>
        {error && (
          <Text variant="caption" className="text-amber-600 mt-1">
            ⚠️ Showing fallback data due to API error
          </Text>
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banks.map((bank) => (
            <div
              key={bank.id}
              className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${getBankTypeColor(bank)} flex items-center justify-center`}>
                    <Text variant="body" className="text-white font-bold text-sm">
                      {bank.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text variant="body" className="font-semibold text-gray-900 truncate">
                      {bank.name}
                    </Text>
                    <Text variant="caption" className="text-gray-500">
                      {getBankTypeLabel(bank)}
                    </Text>
                  </div>
                </div>
                {getStatusBadge(bank)}
              </div>

              {/* Bank Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <Text variant="caption" className="text-gray-500">SWIFT Code</Text>
                  <Text variant="caption" className="font-mono text-gray-700">{bank.swift}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text variant="caption" className="text-gray-500">Account Length</Text>
                  <Text variant="caption" className="text-gray-700">{bank.acct_length} digits</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text variant="caption" className="text-gray-500">Currency</Text>
                  <Text variant="caption" className="text-gray-700">{bank.currency}</Text>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2">
                <Text variant="caption" className="text-gray-500 font-medium">Services</Text>
                <div className="flex flex-wrap gap-1">
                  {getServicesBadges(bank)}
                </div>
              </div>

              {/* RTGS Indicator */}
              {bank.is_rtgs === 1 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Icon name="checkCircle" size="sm" className="text-green-500" />
                    <Text variant="caption" className="text-green-600 font-medium">
                      RTGS Enabled
                    </Text>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {banks.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Icon name="creditCard" size="lg" className="text-gray-400 mx-auto mb-4" />
          <Text variant="h6" className="text-gray-500">
            No banks available
          </Text>
          <Text variant="caption" className="text-gray-400 mt-2">
            Banks will appear here once loaded
          </Text>
        </div>
      )}
    </div>
  );
};