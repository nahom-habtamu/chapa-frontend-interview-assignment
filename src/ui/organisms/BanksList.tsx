import React from "react";
import { Icon } from "../atoms/Icons";
import { Text } from "../atoms/Text";

export interface Bank {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

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
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200/60">
        <Text variant="h6" className="font-semibold text-gray-900">
          Supported Banks
        </Text>
        <Text variant="caption" className="text-gray-500 mt-1">
          Banks available for payment processing ({banks.length} banks)
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
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Text variant="body" className="text-white font-bold text-sm">
                  {bank.code.substring(0, 2)}
                </Text>
              </div>
              <div className="ml-3 flex-1">
                <Text variant="body" className="font-medium text-gray-900">
                  {bank.name}
                </Text>
                <Text variant="caption" className="text-gray-500">
                  {bank.code}
                </Text>
              </div>
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