"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../data/auth/use-auth";
import { UserDashboard } from "../../feature/user-dashboard/UserDashboard";
import { Footer } from "../../ui/molecules/Footer";
import { Navbar } from "../../ui/molecules/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "home" as const, isActive: true },
    { label: "Transactions", href: "/transactions", icon: "fileText" as const },
    { label: "Settings", href: "/settings", icon: "settings" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        navItems={navItems}
        user={{
          name: user.name,
          email: user.email,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        }}
        onLogout={logout}
      />
      
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <UserDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
}