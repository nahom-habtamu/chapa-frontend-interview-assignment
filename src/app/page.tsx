"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../data/auth/use-auth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading spinner while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-primary mb-2">Chapa Pay</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
