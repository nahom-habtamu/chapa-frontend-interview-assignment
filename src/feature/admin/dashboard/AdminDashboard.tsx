import { useRouter } from "next/navigation";
import { useUsers } from "../../../data/admin";
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
      </div>
    </div>
  );
};