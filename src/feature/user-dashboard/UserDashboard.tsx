import React, { useState } from "react";
import { Transaction } from "../../data/payment/types";
import { useRecentTransactions, useWalletBalance } from "../../data/transaction/use-transactions";
import { Icon } from "../../ui/atoms/Icons";
import { Text } from "../../ui/atoms/Text";
import { PaymentForm } from "../../ui/organisms/PaymentForm";
import { TransactionTable } from "../../ui/organisms/TransactionTable";
import { VerifyTransactionForm } from "../../ui/organisms/VerifyTransactionForm";
import { WalletCard } from "../../ui/organisms/WalletCard";

type TabType = "overview" | "pay" | "verify";

interface UserDashboardProps {
  className?: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { data: walletBalance, isLoading: isLoadingBalance } = useWalletBalance();
  const { data: recentTransactions, isLoading: isLoadingTransactions } = useRecentTransactions(5);

  const handleViewTransaction = (transaction: Transaction) => {
    console.log("View transaction:", transaction);
  };

  const handlePaymentSuccess = () => {
    console.log("Payment initialized successfully");
  };

  const handleVerificationSuccess = (data: unknown) => {
    console.log("Transaction verified:", data);
  };

  const tabs = [
    {
      id: "overview" as TabType,
      label: "Overview",
      icon: "home" as const,
    },
    {
      id: "pay" as TabType,
      label: "Make Payment",
      icon: "creditCard" as const,
    },
    {
      id: "verify" as TabType,
      label: "Verify Transaction",
      icon: "search" as const,
    },
  ];

  return (
    <div className={className}>
      <div className="mb-8">
        <Text variant="h2" className="mb-2 font-bold text-gray-900">
          Dashboard
        </Text>
        <Text variant="body" className="text-gray-600">
          Manage your payments and view transaction history
        </Text>
      </div>

      <div className="border-b border-gray-200/70 mb-8">
        <nav className="-mb-px flex space-x-1 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-3 px-3 sm:px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary-light/20"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              <Icon name={tab.icon} size="sm" className="mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <WalletCard
            balance={walletBalance}
            isLoading={isLoadingBalance}
            onAddFunds={() => setActiveTab("pay")}
            onWithdraw={() => {
              console.log("Withdraw funds");
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100/80 p-3 mr-4">
                  <Icon name="trendingUp" size="lg" className="text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text variant="h4" className="font-bold text-gray-900 truncate">
                    {recentTransactions?.filter(t => t.status === "success").length || 0}
                  </Text>
                  <Text variant="caption" className="text-gray-500">
                    Successful Transactions
                  </Text>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="rounded-lg bg-amber-100/80 p-3 mr-4">
                  <Icon name="clock" size="lg" className="text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text variant="h4" className="font-bold text-gray-900 truncate">
                    {recentTransactions?.filter(t => t.status === "pending").length || 0}
                  </Text>
                  <Text variant="caption" className="text-gray-500">
                    Pending Transactions
                  </Text>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
                <div className="rounded-lg bg-primary-light/30 p-3 mr-4">
                  <Icon name="dollarSign" size="lg" className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text variant="h4" className="font-bold text-gray-900 truncate">
                    {recentTransactions?.reduce((sum, t) => 
                      t.status === "success" ? sum + t.amount : sum, 0
                    )?.toFixed(2) || "0.00"}
                  </Text>
                  <Text variant="caption" className="text-gray-500">
                    Total Volume (ETB)
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <TransactionTable
            transactions={recentTransactions}
            isLoading={isLoadingTransactions}
            title="Recent Transactions"
            subtitle="Your latest 5 payment activities"
            showViewAllLink={true}
            viewAllHref="/transactions"
            onViewTransaction={handleViewTransaction}
          />
        </div>
      )}

      {activeTab === "pay" && (
        <div className="max-w-2xl mx-auto lg:mx-0">
          <PaymentForm onSuccess={handlePaymentSuccess} />
        </div>
      )}

      {activeTab === "verify" && (
        <div className="max-w-2xl mx-auto lg:mx-0">
          <VerifyTransactionForm onSuccess={handleVerificationSuccess} />
        </div>
      )}
    </div>
  );
};