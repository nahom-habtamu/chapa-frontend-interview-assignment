import React from "react";
import { UserPaymentSummary } from "../../data/admin";
import { Icon } from "../atoms/Icons";
import { Text } from "../atoms/Text";

interface PaymentSummaryTableProps {
  paymentSummaries: UserPaymentSummary[];
  loading?: boolean;
}

export const PaymentSummaryTable: React.FC<PaymentSummaryTableProps> = ({
  paymentSummaries,
  loading = false,
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "ETB" ? "ETB" : "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const totalAmount = paymentSummaries.reduce((sum, summary) => sum + summary.totalAmount, 0);
  const totalTransactions = paymentSummaries.reduce((sum, summary) => sum + summary.transactionCount, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200/60">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="h6" className="font-semibold text-gray-900">
              Payment Summary
            </Text>
            <Text variant="caption" className="text-gray-500 mt-1">
              User payment statistics and transaction history
            </Text>
          </div>
          <div className="text-right">
            <Text variant="caption" className="text-gray-500">
              Total Revenue
            </Text>
            <Text variant="h5" className="font-bold text-primary">
              {formatCurrency(totalAmount, "ETB")}
            </Text>
            <Text variant="caption" className="text-gray-500">
              {totalTransactions} transactions
            </Text>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transactions
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/60">
            {paymentSummaries.map((summary) => (
              <tr key={summary.userId} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                      <Text variant="body" className="text-white font-semibold text-sm">
                        {summary.userName.charAt(0).toUpperCase()}
                      </Text>
                    </div>
                    <div className="ml-4">
                      <Text variant="body" className="font-medium text-gray-900">
                        {summary.userName}
                      </Text>
                      <Text variant="caption" className="text-gray-500">
                        ID: {summary.userId}
                      </Text>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="font-semibold text-gray-900">
                    {formatCurrency(summary.totalAmount, summary.currency)}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Icon name="creditCard" size="sm" className="text-gray-400" />
                    <Text variant="body" className="text-gray-900">
                      {summary.transactionCount}
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="text-gray-900">
                    {formatDate(summary.lastTransactionDate)}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="text-gray-900">
                    {formatCurrency(summary.totalAmount / summary.transactionCount, summary.currency)}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {paymentSummaries.length === 0 && (
        <div className="text-center py-12">
          <Icon name="creditCard" size="lg" className="text-gray-400 mx-auto mb-4" />
          <Text variant="h6" className="text-gray-500">
            No payment data found
          </Text>
          <Text variant="caption" className="text-gray-400 mt-2">
            Payment summaries will appear here once users make transactions
          </Text>
        </div>
      )}
    </div>
  );
};