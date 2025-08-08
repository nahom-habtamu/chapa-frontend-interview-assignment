"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../data/auth/use-auth";
import { LoginForm } from "../../feature/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-8">Chapa Pay</h1>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">
          <LoginForm onSuccess={() => router.push("/")} />
        </div>
      </div>
    </div>
  );
}