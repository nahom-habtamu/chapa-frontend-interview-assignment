import React from "react";
import { useLogin } from "../../data/auth/use-auth";
import { Button } from "../../ui/atoms/Button";
import { Icon } from "../../ui/atoms/Icons";
import { Input } from "../../ui/atoms/Input";
import { Link } from "../../ui/atoms/Link";
import { Text } from "../../ui/atoms/Text";

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({  className }) => {
  const { form, handleLogin, isLoading, error } = useLogin();

  const { register, formState: { errors } } = form;


  return (
    <div className={className}>
      <div className="text-center mb-8">
        <Text variant="h2" className="mb-2">
          Welcome back
        </Text>
        <Text variant="caption">
          Sign in to your Chapa Pay account
        </Text>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          placeholder="Enter your password"
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <Icon name="alertCircle" size="sm" className="text-red-400 mr-3 mt-0.5" />
              <Text variant="caption" className="text-red-800">
                {error}
              </Text>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading && <Icon name="refresh" size="sm" className="mr-2 animate-spin" />}
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Text variant="caption">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium">
            Sign up
          </Link>
        </Text>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <Text variant="caption" className="text-blue-800 mb-2 block font-medium">
          Demo Credentials:
        </Text>
        <div className="space-y-1 text-sm text-blue-700">
          <div>User: user@example.com / user123</div>
          <div>Admin: admin@example.com / admin123</div>
          <div>Super Admin: superadmin@example.com / super123</div>
        </div>
      </div>
    </div>
  );
};