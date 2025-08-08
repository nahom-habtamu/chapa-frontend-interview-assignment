import React from "react";
import { Transaction } from "../../data/payment/types";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon, type IconName } from "../atoms/Icons";
import { Text } from "../atoms/Text";

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  const getTypeIcon = (type: Transaction["type"]): IconName => {
    const icons = {
      payment: "arrowUpRight",
      payout: "arrowDownLeft",
      refund: "arrowDownLeft",
    };
    return icons[type] as IconName || "creditCard";
  };

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-gray-100/80 p-2">
                <Icon 
                  name={getTypeIcon(transaction.type)} 
                  size="sm" 
                  className="text-gray-600"
                />
              </div>
              <Text variant="h6" className="font-semibold text-gray-900">
                Transaction Details
              </Text>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Icon name="x" size="sm" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="text-center pb-4 border-b border-gray-100">
              <Text variant="h3" className="font-bold text-gray-900">
                {formatCurrency(transaction.amount, transaction.currency)}
              </Text>
              <Badge variant={transaction.status} icon={true} className="mt-2">
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <Text variant="caption" className="text-gray-500 font-medium">
                  Description
                </Text>
                <Text variant="body" className="text-gray-900">
                  {transaction.description}
                </Text>
              </div>

              <div>
                <Text variant="caption" className="text-gray-500 font-medium">
                  Reference
                </Text>
                <Text variant="body" className="text-gray-900 font-mono text-sm">
                  {transaction.reference}
                </Text>
              </div>

              {transaction.recipient && (
                <div>
                  <Text variant="caption" className="text-gray-500 font-medium">
                    Recipient
                  </Text>
                  <Text variant="body" className="text-gray-900">
                    {transaction.recipient}
                  </Text>
                </div>
              )}

              <div>
                <Text variant="caption" className="text-gray-500 font-medium">
                  Type
                </Text>
                <Text variant="body" className="text-gray-900 capitalize">
                  {transaction.type}
                </Text>
              </div>

              <div>
                <Text variant="caption" className="text-gray-500 font-medium">
                  Date
                </Text>
                <Text variant="body" className="text-gray-900">
                  {formatDate(transaction.created_at)}
                </Text>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};