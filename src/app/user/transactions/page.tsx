"use client";

import React from "react";
import { Transaction } from "../../../data/payment/types";
import { useTransactions } from "../../../data/transaction/use-transactions";
import { Button } from "../../../ui/atoms/Button";
import { Icon } from "../../../ui/atoms/Icons";
import { Text } from "../../../ui/atoms/Text";
import { TransactionModal } from "../../../ui/organisms/TransactionModal";
import { TransactionTable } from "../../../ui/organisms/TransactionTable";

export default function TransactionsPage() {
  const { data: transactionData, isLoading: transactionsLoading } = useTransactions({ limit: 100 }); // Show more transactions
  const transactions = transactionData?.transactions || [];
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        onViewTransaction={(transaction) => {
          setSelectedTransaction(transaction);
          setIsModalOpen(true);
        }}
      />

      {/* Transaction Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
}