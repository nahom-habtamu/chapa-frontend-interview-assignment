"use client";

import { useRouter } from "next/navigation";
import { useAdminUsers, useUserPaymentSummaries } from "../../../data/admin";
import { useAuth } from "../../../data/auth/use-auth";
import { useBanks } from "../../../data/payment";
import { Button } from "../../../ui/atoms/Button";
import { Icon } from "../../../ui/atoms/Icons";
import { Text } from "../../../ui/atoms/Text";
import { BanksList, PaymentSummaryTable, UserTable } from "../../../ui/organisms";

export default function AdminDashboard() {
  const { users, loading: usersLoading, toggleUserStatus } = useAdminUsers();
  const { paymentSummaries, loading: paymentsLoading } = useUserPaymentSummaries();
  const { banks, loading: banksLoading, error: banksError } = useBanks();
  const { isSuperAdmin } = useAuth();
  const router = useRouter();

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const totalRevenue = paymentSummaries.reduce((sum, summary) => sum + summary.totalAmount, 0);
  const totalTransactions = paymentSummaries.reduce((sum, summary) => sum + summary.transactionCount, 0);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: "users" as const,
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
      change: `${Math.round((activeUsers / totalUsers) * 100)}%`,
      changeType: "positive" as const,
      icon: "userCheck" as const,
    },
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ETB",
        minimumFractionDigits: 0,
      }).format(totalRevenue),
      change: "+8.2%",
      changeType: "positive" as const,
      icon: "dollarSign" as const,
    },
    {
      title: "Transactions",
      value: totalTransactions.toString(),
      change: "+15.3%",
      changeType: "positive" as const,
      icon: "creditCard" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="h2" className="text-gray-900 font-bold">
              {isSuperAdmin() ? "Super Admin Dashboard" : "Admin Dashboard"}
            </Text>
            <Text variant="body" className="text-gray-600 mt-2">
              {isSuperAdmin() 
                ? "Complete system oversight and administrative controls" 
                : "Monitor users, payments, and system health"
              }
            </Text>
          </div>
          {isSuperAdmin() && (
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => router.push("/admin/manage-admins")}
              >
                <Icon name="shield" size="sm" />
                <span>Manage Admins</span>
              </Button>
              <Button 
                className="flex items-center space-x-2"
                onClick={() => router.push("/admin/transfers")}
              >
                <Icon name="arrowUpRight" size="sm" />
                <span>Transfer Center</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <Text variant="caption" className="text-gray-500 font-medium">
                  {stat.title}
                </Text>
                <Text variant="h4" className="text-gray-900 font-bold mt-2">
                  {stat.value}
                </Text>
                <div className="flex items-center mt-2">
                  <Icon
                    name="trendingUp"
                    size="sm"
                    className={`mr-1 ${
                      stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <Text
                    variant="caption"
                    className={`font-medium ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </Text>
                  <Text variant="caption" className="text-gray-500 ml-1">
                    vs last month
                  </Text>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Icon name={stat.icon} size="md" className="text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - User Management */}
        <div className="xl:col-span-2 space-y-8">
          <UserTable
            users={users}
            onToggleStatus={toggleUserStatus}
            loading={usersLoading}
          />
          
          <PaymentSummaryTable
            paymentSummaries={paymentSummaries}
            loading={paymentsLoading}
          />
        </div>

        {/* Right Column - Banks */}
        <div className="xl:col-span-1">
          <BanksList 
            banks={banks}
            loading={banksLoading}
            error={banksError}
          />
        </div>
      </div>
    </div>
  );
}