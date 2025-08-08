import React from "react";
import { useLogin } from "../../../data/auth/use-auth";
import { Button } from "../../../ui/atoms/Button";
import { Input } from "../../../ui/atoms/Input";
import { Text } from "../../../ui/atoms/Text";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { mutate: login, isPending: isLoading, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

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
            {error.message}
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

      <div className="text-center">
        <Text variant="caption" className="text-gray-600">
          Demo credentials: user@chapa.co / user123, admin@chapa.co / admin123
        </Text>
      </div>
    </form>
  );
};