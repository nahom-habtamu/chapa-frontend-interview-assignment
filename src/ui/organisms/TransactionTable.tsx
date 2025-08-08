import React from "react";
import { Transaction } from "../../data/user/use-transactions/types";
import { useVerifyTransaction } from "../../data/user/use-verify-transaction/useVerifyTransaction";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon, type IconName } from "../atoms/Icons";
import { Link } from "../atoms/Link";
import { Text } from "../atoms/Text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../molecules/Table";
import { cn } from "../utils/cn";

interface TransactionTableProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  showActions?: boolean;
  onViewTransaction?: (transaction: Transaction) => void;
  onVerifyTransaction?: (transaction: Transaction) => void;
  isVerifying?: boolean;
  verifyingReference?: string | null;
  className?: string;
  title?: string;
  subtitle?: string;
  showViewAllLink?: boolean;
  viewAllHref?: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions = [],
  isLoading,
  showActions = true,
  onViewTransaction,
  onVerifyTransaction,
  isVerifying = false,
  verifyingReference = null,
  className,
  title = "Recent Transactions",
  subtitle = "Track all your payment activities",
  showViewAllLink = false,
  viewAllHref = "/transactions",
}) => {
  const { verifyTransaction } = useVerifyTransaction();
  const [localVerifyingRef, setLocalVerifyingRef] = React.useState<string | null>(null);

  const handleVerifyClick = (transaction: Transaction) => {
    if (transaction.reference) {
      setLocalVerifyingRef(transaction.reference);
      verifyTransaction(
        { txRef: transaction.reference },
        {
          onSettled: () => {
            setLocalVerifyingRef(null);
          },
        }
      );
    }
  };

  const getTypeIcon = (type: Transaction["type"]): IconName => {
    const icons = {
      payment: "arrowUpRight",
      payout: "arrowDownLeft",
      refund: "arrowDownLeft",
      transfer: "arrowUpRight",
    };
    return icons[type] as IconName || "creditCard";
  };

  const getStatusVariant = (status: Transaction["status"]) => {
    if (status === "processing") return "pending";
    return status;
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className={cn("rounded-lg border border-gray-200 bg-white", className)}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-200/80 bg-white shadow-sm", className)}>
      <div className="p-6 border-b border-gray-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Text variant="h5" className="font-semibold text-gray-900">
              {title}
            </Text>
            <Text variant="caption" className="text-gray-500 mt-1">
              {subtitle}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            {showViewAllLink && (
              <Link 
                href={viewAllHref}
                variant="ghost"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            )}
            <Button variant="ghost" size="sm" className="self-start sm:self-auto">
              <Icon name="filter" size="sm" className="mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="rounded-full bg-gray-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Icon name="fileText" size="lg" className="text-gray-400" />
          </div>
          <Text variant="h6" className="mb-2">
            No transactions yet
          </Text>
          <Text variant="caption">
            Your transaction history will appear here once you make your first payment.
          </Text>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Transaction</TableHead>
                <TableHead className="text-right sm:text-left">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                {showActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center min-w-0">
                    <div className="rounded-lg bg-gray-100/80 p-2.5 mr-3 flex-shrink-0">
                      <Icon 
                        name={getTypeIcon(transaction.type)} 
                        size="sm" 
                        className="text-gray-600"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Text variant="body" className="font-semibold text-gray-900 truncate">
                        {transaction.description}
                      </Text>
                      <Text variant="caption" className="text-gray-500 truncate">
                        {transaction.reference}
                      </Text>
                      <div className="md:hidden mt-1">
                        <Text variant="caption" className="text-gray-500">
                          {formatDate(transaction.created_at)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right sm:text-left">
                  <div className="text-right sm:text-left">
                    <Text variant="body" className="font-semibold text-gray-900">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </Text>
                    {transaction.recipient && (
                      <Text variant="caption" className="text-gray-500 block">
                        to {transaction.recipient}
                      </Text>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Badge variant={getStatusVariant(transaction.status)} icon={true}>
                    <span className="hidden sm:inline">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell className="py-4 hidden md:table-cell">
                  <Text variant="body" className="text-gray-900">
                    {formatDate(transaction.created_at)}
                  </Text>
                </TableCell>
                {showActions && (
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTransaction?.(transaction)}
                        className="hover:bg-gray-100"
                      >
                        <Icon name="eye" size="sm" className="mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyClick(transaction)}
                        disabled={localVerifyingRef === transaction.reference}
                        className="hover:bg-gray-100"
                      >
                        {localVerifyingRef === transaction.reference && (
                          <Icon name="refresh" size="sm" className="mr-1 animate-spin" />
                        )}
                        <span className="hidden sm:inline">
                          {localVerifyingRef === transaction.reference ? "Verifying..." : "Verify"}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};