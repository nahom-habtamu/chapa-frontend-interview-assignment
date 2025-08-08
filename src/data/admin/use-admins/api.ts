import { AdminUser } from "../../common/types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAdmins = async (): Promise<AdminUser[]> => {
  await delay(600);
  const { mockAdmins } = await import("../../common/mock-data");
  return mockAdmins.filter(user =>
    user.role === "admin" || user.role === "super_admin"
  ).map(user => ({
    ...user,
    role: user.role as "admin" | "super_admin",
    permissions: user.role === "super_admin" ? ["all"] : ["read", "write"]
  }));
};

export const createAdmin = async (admin: Omit<AdminUser, "id" | "createdAt" | "updatedAt">): Promise<AdminUser> => {
  await delay(800);
  return {
    ...admin,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const updateAdmin = async (id: string, admin: Partial<AdminUser>): Promise<AdminUser> => {
  await delay(600);
  const { mockAdmins } = await import("../../common/mock-data");
  const existingAdmin = mockAdmins.find(a => a.id === id);

  if (!existingAdmin || (existingAdmin.role !== "admin" && existingAdmin.role !== "super_admin")) {
    throw new Error("Admin not found");
  }

  return {
    ...existingAdmin,
    ...admin,
    role: existingAdmin.role as "admin" | "super_admin",
    permissions: existingAdmin.role === "super_admin" ? ["all"] : ["read", "write"],
    updatedAt: new Date().toISOString(),
  };
};

export const deactivateAdmin = async (id: string): Promise<AdminUser> => {
  await delay(500);
  const { mockAdmins } = await import("../../common/mock-data");
  const admin = mockAdmins.find(a => a.id === id);

  if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
    throw new Error("Admin not found");
  }

  return {
    ...admin,
    role: admin.role as "admin" | "super_admin",
    permissions: admin.role === "super_admin" ? ["all"] : ["read", "write"],
    isDeactivated: true
  };
};

export const reactivateAdmin = async (id: string): Promise<AdminUser> => {
  await delay(500);
  const { mockAdmins } = await import("../../common/mock-data");
  const admin = mockAdmins.find(a => a.id === id);

  if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
    throw new Error("Admin not found");
  }

  return {
    ...admin,
    role: admin.role as "admin" | "super_admin",
    permissions: admin.role === "super_admin" ? ["all"] : ["read", "write"],
    isDeactivated: false
  };
};

export const deleteAdmin = async (id: string): Promise<void> => {
  await delay(600);
  const { mockAdmins } = await import("../../common/mock-data");
  const admin = mockAdmins.find(a => a.id === id);

  if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
    throw new Error("Admin not found");
  }
};