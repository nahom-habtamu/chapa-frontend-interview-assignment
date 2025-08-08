import { useAuth } from "../../../data/auth/use-auth";
import { Icon } from "../../../ui/atoms/Icons";
import { Text } from "../../../ui/atoms/Text";

interface SettingsProps {
  className?: string;
  isAdmin?: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ className, isAdmin = false }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={className}>
      <div className="text-center">
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="settings" size="lg" className="text-primary" />
            </div>
            <Text variant="h3" className="font-bold text-gray-900 mb-2">
              {isAdmin ? "Admin Settings Coming Soon" : "Settings Coming Soon"}
            </Text>
            <Text variant="body" className="text-gray-600 mb-6">
              We&apos;re working hard to bring you comprehensive {isAdmin ? "administrative" : "account"} settings. Check back soon for updates!
            </Text>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                <Text variant="body" className="text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </div>
              <div className="text-left">
                <Text variant="body" className="font-semibold">
                  {user.name}
                </Text>
                <Text variant="caption" className="text-gray-500">
                  {user.email}
                </Text>
                <Text variant="caption" className="text-gray-500">
                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
                </Text>
              </div>
            </div>
            <Text variant="caption" className="text-gray-600">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </div>

          {isAdmin && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6">
              <Text variant="h6" className="text-blue-900 font-semibold mb-2">
                System Configuration
              </Text>
              <Text variant="body" className="text-blue-700">
                Additional system settings will be available here in future releases.
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};