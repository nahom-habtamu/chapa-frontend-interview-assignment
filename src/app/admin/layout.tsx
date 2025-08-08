"use client";

import { usePathname } from "next/navigation";
import { useAuth, useLogout } from "../../data/auth/use-auth";
import { Footer } from "../../ui/molecules/Footer";
import { Navbar, type NavItem } from "../../ui/molecules/Navbar";

const getAdminNavItems = (isSuperAdmin: boolean): NavItem[] => [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "home" as const,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "user" as const,
  },
  {
    label: "Banks",
    href: "/admin/banks",
    icon: "creditCard" as const,
  },
  ...(isSuperAdmin ? [{
    label: "Manage Admins",
    href: "/admin/manage-admins",
    icon: "shield" as const,
  }] : []),
  ...(isSuperAdmin ? [{
    label: "Transfers",
    href: "/admin/transfers",
    icon: "arrowUpRight" as const,
  }] : []),
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "settings" as const,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isSuperAdmin } = useAuth();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const userInfo = user ? {
    name: user.name,
    email: user.email,
    role: isSuperAdmin() ? "Super Administrator" : "Administrator",
  } : {
    name: "Admin User",
    email: "admin@chapa.co",
    role: "Administrator",
  };

  const adminNavItems = getAdminNavItems(isSuperAdmin());

  const navItemsWithActive = adminNavItems.map(item => ({
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