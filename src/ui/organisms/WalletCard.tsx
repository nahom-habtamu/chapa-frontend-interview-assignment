import React from "react";
import { WalletBalance } from "../../data/user/use-transactions/types";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icons";
import { Text } from "../atoms/Text";
import { cn } from "../utils/cn";

interface WalletCardProps {
  balance?: WalletBalance;
  isLoading?: boolean;
  onAddFunds?: () => void;
  onWithdraw?: () => void;
  className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  isLoading,
  onAddFunds,
  onWithdraw,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "ETB" ? "ETB" : "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={cn(
      "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-2 mr-3">
            <Icon name="wallet" size="lg" className="text-blue-600" />
          </div>
          <Text variant="h5" className="font-semibold">
            Wallet Balance
          </Text>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.reload()}
          className="text-gray-500 hover:text-gray-700"
        >
          <Icon name="refresh" size="sm" />
        </Button>
      </div>

      {balance && (
        <div className="space-y-4">
          <div>
            <Text variant="h2" className="font-bold text-gray-900">
              {formatCurrency(balance.available, balance.currency)}
            </Text>
            <Text variant="caption" className="text-gray-500">
              Available Balance
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
            <div>
              <Text variant="body" className="font-medium text-gray-900">
                {formatCurrency(balance.pending, balance.currency)}
              </Text>
              <Text variant="caption" className="text-gray-500">
                Pending
              </Text>
            </div>
            <div>
              <Text variant="body" className="font-medium text-gray-900">
                {formatCurrency(balance.total, balance.currency)}
              </Text>
              <Text variant="caption" className="text-gray-500">
                Total
              </Text>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onAddFunds}
              className="flex-1"
              size="lg"
            >
              <Icon name="plus" size="sm" className="mr-2" />
              Add Funds
            </Button>
            <Button
              onClick={onWithdraw}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Icon name="arrowUpRight" size="sm" className="mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};