import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCurrentUser, loginUser } from "./auth-api";
import { loginSchema, type LoginFormData } from "./auth-schema";
import { AuthResponse } from "./types";

const TOKEN_KEY = "chapa_auth_token";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
      setStoredToken(data.token.access_token);
      queryClient.setQueryData(["current-user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
    },
  });

  const handleLogin = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    handleLogin,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};

export const useCurrentUser = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only access localStorage after hydration
    setToken(getStoredToken());
    setIsHydrated(true);
  }, []);

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () => {
      if (!token) throw new Error("No token found");
      return getCurrentUser(token);
    },
    enabled: !!token && isHydrated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading || !isHydrated,
    isError: query.isError,
    error: query.error?.message,
    isAuthenticated: !!query.data && !query.isError,
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    removeStoredToken();
    queryClient.setQueryData(["current-user"], null);
    queryClient.clear();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return { logout };
};

export const useAuth = () => {
  const { user, isLoading, isError, error, isAuthenticated } = useCurrentUser();
  const { logout } = useLogout();

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const isAdmin = () => hasRole(["admin", "super_admin"]);
  const isSuperAdmin = () => hasRole("super_admin");

  return {
    user,
    isLoading,
    isError,
    error,
    isAuthenticated,
    logout,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
};