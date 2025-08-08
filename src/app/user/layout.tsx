"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../data/auth/use-auth";
import { Footer } from "../../ui/molecules/Footer";
import { Navbar, type NavItem } from "../../ui/molecules/Navbar";

const userNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/user/dashboard",
    icon: "home",
  },
  {
    label: "Transactions",
    href: "/user/transactions",
    icon: "creditCard",
  },
  {
    label: "Profile",
    href: "/user/profile",
    icon: "user",
  },
  {
    label: "Settings",
    href: "/user/settings",
    icon: "settings",
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  // Prepare user info for navbar
  const userInfo = user ? {
    name: user.name,
    email: user.email,
    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
  } : {
    name: "Guest User",
    email: "guest@example.com",
    role: "Guest",
  };

  // Set active state for nav items
  const navItemsWithActive = userNavItems.map(item => ({
    ...item,
    isActive: pathname === item.href,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        navItems={navItemsWithActive}
        user={userInfo}
        onLogout={handleLogout}
        showUserMenu={true}
      />
      <main className="flex-1 bg-gray-50">
        <div className="min-h-full py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}