"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../data/auth/use-auth";
import { Icon } from "../../ui/atoms/Icons";
import { Text } from "../../ui/atoms/Text";
import { Footer } from "../../ui/molecules/Footer";
import { Navbar } from "../../ui/molecules/Navbar";

export default function SettingsPage() {
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
    { label: "Dashboard", href: "/dashboard", icon: "home" as const },
    { label: "Transactions", href: "/transactions", icon: "fileText" as const },
    { label: "Settings", href: "/settings", icon: "settings" as const, isActive: true },
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
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="settings" size="lg" className="text-primary" />
                </div>
                <Text variant="h3" className="font-bold text-gray-900 mb-2">
                  Settings Coming Soon
                </Text>
                <Text variant="body" className="text-gray-600 mb-6">
                  We&apos;re working hard to bring you comprehensive account settings. Check back soon for updates!
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
                  </div>
                </div>
                <Text variant="caption" className="text-gray-600">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}