import { useRouter } from "next/navigation";
import { useBanks, useUsers } from "../../../data/admin";
import { useAuth } from "../../../data/auth/use-auth";
import { Button } from "../../../ui/atoms/Button";
import { Icon } from "../../../ui/atoms/Icons";
import { Text } from "../../../ui/atoms/Text";
import { UserTable } from "../../../ui/organisms";

interface AdminDashboardProps {
  className?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ className }) => {
  const { users, loading: usersLoading, toggleUserStatus } = useUsers();
  const { banks, loading: banksLoading, error: banksError } = useBanks();
  const { isSuperAdmin } = useAuth();
  const router = useRouter();

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive && !user.isDeactivated).length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: "users" as const,
    },
    {
      title: "Active Users", 
      value: activeUsers.toString(),
      icon: "userCheck" as const,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <Text variant="caption" className="text-gray-500 font-medium">
                  {stat.title}
                </Text>
                <Text variant="h4" className="text-gray-900 font-bold mt-2">
                  {stat.value}
                </Text>
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
        <UserTable
          users={users.slice(0, 5)}
          onToggleStatus={toggleUserStatus}
          loading={usersLoading}
        />
        
        {/* Banks Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Text variant="h6" className="text-gray-900 font-semibold">
                Partner Banks
              </Text>
              <Text variant="caption" className="text-gray-500">
                {banksLoading ? "Loading banks..." : `${banks.length} banks available`}
              </Text>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/admin/banks")}
            >
              View All Banks
            </Button>
          </div>
          
          {banksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : banksError ? (
            <div className="text-center py-4">
              <Icon name="alertCircle" size="md" className="text-red-500 mx-auto mb-2" />
              <Text variant="caption" className="text-red-600">
                Failed to load banks
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banks.slice(0, 6).map((bank) => (
                <div key={bank.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Text variant="caption" className="text-white font-bold">
                      {bank.name.substring(0, 2).toUpperCase()}
                    </Text>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <Text variant="body" className="text-gray-900 font-medium truncate">
                      {bank.name}
                    </Text>
                    <Text variant="caption" className="text-gray-500">
                      {bank.slug.toUpperCase()}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};