import { useUsers } from "../../../data/admin";
import { Text } from "../../../ui/atoms/Text";
import { UserTable } from "../../../ui/organisms";

interface AdminUsersProps {
  className?: string;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ className }) => {
  const { users, loading, toggleUserStatus } = useUsers();

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive && !user.isDeactivated).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <Text variant="h2" className="text-gray-900 font-bold">
          User Management
        </Text>
        <Text variant="body" className="text-gray-600 mt-2">
          Manage user accounts and their access to the platform
        </Text>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Total Users
              </Text>
              <Text variant="h4" className="text-gray-900 font-bold mt-2">
                {totalUsers}
              </Text>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Text variant="h5" className="text-blue-600 font-bold">
                👥
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Active Users
              </Text>
              <Text variant="h4" className="text-green-600 font-bold mt-2">
                {activeUsers}
              </Text>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <Text variant="h5" className="text-green-600 font-bold">
                ✅
              </Text>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Inactive Users
              </Text>
              <Text variant="h4" className="text-red-600 font-bold mt-2">
                {inactiveUsers}
              </Text>
            </div>
            <div className="rounded-lg bg-red-100 p-3">
              <Text variant="h5" className="text-red-600 font-bold">
                ❌
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        onToggleStatus={toggleUserStatus}
        loading={loading}
      />
    </div>
  );
};