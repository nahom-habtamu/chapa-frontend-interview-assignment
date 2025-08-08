import React from "react";
import { useLogin } from "../../../data/auth/use-auth";
import { Button, Input, Text } from "../../../ui/atoms";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login, isLoading, error, isSuccess } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  React.useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Text variant="h4" className="font-bold text-gray-900 mb-6 text-center">
          Sign in to your account
        </Text>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <Text variant="body" className="text-red-800">
            {error}
          </Text>
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </div>

      <div className="text-center space-y-1">
        <Text variant="caption" className="text-gray-600 block font-medium">
          Demo credentials:
        </Text>
        <Text variant="caption" className="text-gray-600 block">
          Users: john.doe@example.com, jane.smith@example.com, sarah.wilson@example.com / user123
        </Text>
        <Text variant="caption" className="text-gray-600 block">
          Admin: admin@chapa.co / admin123
        </Text>
        <Text variant="caption" className="text-gray-600 block">
          Super Admin: superadmin@chapa.co / super123
        </Text>
      </div>
    </form>
  );
};