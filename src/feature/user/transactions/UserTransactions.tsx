import React from "react";
import { useCurrentUser } from "../../../data/auth/use-auth";
import { Transaction, useTransactions } from "../../../data/user/use-transactions";
import { useVerifyTransaction } from "../../../data/user/use-verify-transaction/useVerifyTransaction";
import { Button } from "../../../ui/atoms/Button";
import { Icon } from "../../../ui/atoms/Icons";
import { Text } from "../../../ui/atoms/Text";
import { TransactionModal } from "../../../ui/organisms/TransactionModal";
import { TransactionTable } from "../../../ui/organisms/TransactionTable";

interface UserTransactionsProps {
  className?: string;
}

export const UserTransactions: React.FC<UserTransactionsProps> = ({ className }) => {
  const { user } = useCurrentUser();
  const { transactions, loading: transactionsLoading } = useTransactions(user?.id);
  const { verifyTransaction, isLoading: isVerifying } = useVerifyTransaction();
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [verifyingRef, setVerifyingRef] = React.useState<string | null>(null);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleVerify = (transaction: Transaction) => {
    if (transaction.reference) {
      setVerifyingRef(transaction.reference);
      verifyTransaction(
        { txRef: transaction.reference },
        {
          onSettled: () => {
            setVerifyingRef(null);
          },
        }
      );
    }
  };

  return (
    <div className={className}>
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <Text variant="h2" className="font-bold text-gray-900">
              Transaction History
            </Text>
            <Text variant="body" className="mt-2 text-gray-600">
              View and manage all your payment transactions
            </Text>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <Button>
              <Icon name="download" size="sm" className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        isLoading={transactionsLoading}
        title="All Transactions"
        subtitle={`Showing ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
        onViewTransaction={handleViewTransaction}
        onVerifyTransaction={handleVerify}
        isVerifying={isVerifying}
        verifyingReference={verifyingRef}
      />

      {/* Transaction Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};