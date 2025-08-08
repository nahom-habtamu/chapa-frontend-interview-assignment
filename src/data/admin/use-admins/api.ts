import { AdminUser } from "../../common/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY = "chapa_admin_admins";

function readAdminsFromStorage(): AdminUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminUser[];
    return [];
  } catch {
    return [];
  }
}

function writeAdminsToStorage(admins: AdminUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
}

async function ensureSeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const { mockAdmins } = await import("../../common/mock-data");
    const seeded: AdminUser[] = mockAdmins
      .filter((user) => user.role === "admin" || user.role === "super_admin")
      .map((user) => ({
        ...user,
        role: user.role as "admin" | "super_admin",
        permissions: user.role === "super_admin" ? ["all"] : ["read", "write"],
      }));
    writeAdminsToStorage(seeded);
  }
}

export const getAdmins = async (): Promise<AdminUser[]> => {
  await delay(300);
  await ensureSeeded();
  return readAdminsFromStorage();
};

export const createAdmin = async (
  admin: Omit<AdminUser, "id" | "createdAt" | "updatedAt">
): Promise<AdminUser> => {
  await delay(300);
  await ensureSeeded();
  const admins = readAdminsFromStorage();
  const newAdmin: AdminUser = {
    ...admin,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  admins.unshift(newAdmin);
  writeAdminsToStorage(admins);
  return newAdmin;
};

export const updateAdmin = async (
  id: string,
  admin: Partial<AdminUser>
): Promise<AdminUser> => {
  await delay(300);
  await ensureSeeded();
  const admins = readAdminsFromStorage();
  const idx = admins.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Admin not found");
  const updated: AdminUser = {
    ...admins[idx],
    ...admin,
    updatedAt: new Date().toISOString(),
  };
  admins[idx] = updated;
  writeAdminsToStorage(admins);
  return updated;
};

export const deactivateAdmin = async (id: string): Promise<AdminUser> => {
  await delay(200);
  await ensureSeeded();
  const admins = readAdminsFromStorage();
  const idx = admins.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Admin not found");
  const updated: AdminUser = { ...admins[idx], isDeactivated: true };
  admins[idx] = updated;
  writeAdminsToStorage(admins);
  return updated;
};

export const reactivateAdmin = async (id: string): Promise<AdminUser> => {
  await delay(200);
  await ensureSeeded();
  const admins = readAdminsFromStorage();
  const idx = admins.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Admin not found");
  const updated: AdminUser = { ...admins[idx], isDeactivated: false };
  admins[idx] = updated;
  writeAdminsToStorage(admins);
  return updated;
};

export const deleteAdmin = async (id: string): Promise<void> => {
  await delay(200);
  await ensureSeeded();
  const admins = readAdminsFromStorage();
  const next = admins.filter((a) => a.id !== id);
  if (next.length === admins.length) throw new Error("Admin not found");
  writeAdminsToStorage(next);
};