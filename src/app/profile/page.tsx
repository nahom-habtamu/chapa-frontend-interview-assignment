"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../data/auth/use-auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  React.useEffect(() => {
    // Redirect to settings page as it's more comprehensive
    if (!isLoading && isAuthenticated) {
      router.push("/settings");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
}