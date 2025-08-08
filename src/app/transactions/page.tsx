"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../data/auth/use-auth";
import { Transaction } from "../../data/payment/types";
import { useTransactions } from "../../data/transaction/use-transactions";
import { Button } from "../../ui/atoms/Button";
import { Icon } from "../../ui/atoms/Icons";
import { Text } from "../../ui/atoms/Text";
import { Footer } from "../../ui/molecules/Footer";
import { Navbar } from "../../ui/molecules/Navbar";
import { TransactionModal } from "../../ui/organisms/TransactionModal";
import { TransactionTable } from "../../ui/organisms/TransactionTable";

export default function TransactionsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { data: transactionData, isLoading: transactionsLoading } = useTransactions({ limit: 100 }); // Show more transactions
  const transactions = transactionData?.transactions || [];
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "home" as const },
    { label: "Transactions", href: "/transactions", icon: "fileText" as const, isActive: true },
    { label: "Settings", href: "/settings", icon: "settings" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        navItems={navItems}
        user={{
          name: user.name,
          email: user.email,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        }}
        onLogout={logout}
      />
      
      <main className="py-8">
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
        </div>
      </main>

      <Footer />

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