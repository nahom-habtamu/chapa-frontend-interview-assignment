import React from "react";
import { User } from "../../types/user";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icons";
import { Text } from "../atoms/Text";

interface UserTableProps {
  users: User[];
  onToggleStatus: (userId: string) => void;
  loading?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onToggleStatus,
  loading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200/60">
        <Text variant="h6" className="font-semibold text-gray-900">
          User Management
        </Text>
        <Text variant="caption" className="text-gray-500 mt-1">
          Manage user accounts and their status
        </Text>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/60">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                      <Text variant="body" className="text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </div>
                    <div className="ml-4">
                      <Text variant="body" className="font-medium text-gray-900">
                        {user.name}
                      </Text>
                      <Text variant="caption" className="text-gray-500">
                        ID: {user.id}
                      </Text>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="text-gray-900">
                    {user.email}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={user.isActive ? "success" : "failed"}
                    icon={true}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="text-gray-900">
                    {formatDate(user.createdAt)}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant={user.isActive ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => onToggleStatus(user.id)}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <Icon 
                      name={user.isActive ? "x" : "check"} 
                      size="sm" 
                    />  
                    <span>
                      {user.isActive ? "Deactivate" : "Activate"}
                    </span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <Icon name="user" size="lg" className="text-gray-400 mx-auto mb-4" />
          <Text variant="h6" className="text-gray-500">
            No users found
          </Text>
          <Text variant="caption" className="text-gray-400 mt-2">
            Users will appear here once they register
          </Text>
        </div>
      )}
    </div>
  );
};