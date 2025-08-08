import { useRouter } from "next/navigation";
import { useBanks, useUserPaymentSummaries, useUsers } from "../../data/admin";
import { useAuth } from "../../data/auth/use-auth";
import { Button } from "../../ui/atoms/Button";
import { Icon } from "../../ui/atoms/Icons";
import { Text } from "../../ui/atoms/Text";
import { PaymentSummaryTable, UserTable } from "../../ui/organisms";

interface AdminDashboardProps {
  className?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ className }) => {
  const { users, loading: usersLoading, toggleUserStatus } = useUsers();
  const { paymentSummaries, loading: paymentsLoading } = useUserPaymentSummaries();
  const { banks, loading: banksLoading, error: banksError } = useBanks();
  const { isSuperAdmin } = useAuth();
  const router = useRouter();

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive && !user.isDeactivated).length;
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
    <div className={className}>
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
      <div className="space-y-8">
        {/* User Management */}
        <UserTable
          users={users}
          onToggleStatus={toggleUserStatus}
          loading={usersLoading}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Payment Summaries */}
          <div className="xl:col-span-2">
            <PaymentSummaryTable
              paymentSummaries={paymentSummaries}
              loading={paymentsLoading}
            />
          </div>

          {/* Banks - Compact View */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <Text variant="h6" className="text-gray-900 font-semibold">
                  Partner Banks
                </Text>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <Text variant="caption" className="text-green-600 font-medium">
                    {banks.filter(bank => bank.isActive !== false).length} Active
                  </Text>
                </div>
              </div>
              
              {banksLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : banksError ? (
                <div className="text-center py-4">
                  <Icon name="alertCircle" size="md" className="text-red-500 mx-auto mb-2" />
                  <Text variant="caption" className="text-red-600">
                    {banksError}
                  </Text>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {banks.slice(0, 8).map((bank) => (
                    <div key={bank.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <Text variant="body" className="text-gray-900 font-medium truncate">
                          {bank.name}
                        </Text>
                        <Text variant="caption" className="text-gray-500">
                          {bank.code}
                        </Text>
                      </div>
                      <div className="flex items-center space-x-2">
                        {bank.isActive !== false ? (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        )}
                        <Text variant="caption" className="text-gray-600 text-right">
                          {bank.transferFee ? `${bank.transferFee} ETB` : 'N/A'}
                        </Text>
                      </div>
                    </div>
                  ))}
                  
                  {banks.length > 8 && (
                    <div className="text-center pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push("/admin/banks")}
                      >
                        View All Banks ({banks.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};