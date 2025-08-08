import { BaseUser } from "../../common/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY = "chapa_admin_users";

const readUsersFromStorage = (): BaseUser[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BaseUser[];
    return [];
  } catch {
    return [];
  }
};

function writeUsersToStorage(users: BaseUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

async function ensureSeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const { mockRegularUsers } = await import("../../common/mock-data");
    writeUsersToStorage(mockRegularUsers);
  }
}

export const getUsers = async (): Promise<BaseUser[]> => {
  await delay(300);
  await ensureSeeded();
  return readUsersFromStorage();
};

export const toggleUserStatus = async (id: string): Promise<BaseUser> => {
  await delay(200);
  await ensureSeeded();
  const users = readUsersFromStorage();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  const user = users[idx];
  const newIsActive = !user.isActive;
  const updated: BaseUser = {
    ...user,
    isActive: newIsActive,
    isDeactivated: !newIsActive,
    updatedAt: new Date().toISOString(),
  };
  users[idx] = updated;
  writeUsersToStorage(users);
  return updated;
};

export const deactivateUser = async (id: string): Promise<BaseUser> => {
  await delay(200);
  await ensureSeeded();
  const users = readUsersFromStorage();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  const updated: BaseUser = { ...users[idx], isDeactivated: true };
  users[idx] = updated;
  writeUsersToStorage(users);
  return updated;
};

export const reactivateUser = async (id: string): Promise<BaseUser> => {
  await delay(200);
  await ensureSeeded();
  const users = readUsersFromStorage();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  const updated: BaseUser = { ...users[idx], isDeactivated: false };
  users[idx] = updated;
  writeUsersToStorage(users);
  return updated;
};

export const deleteUser = async (id: string): Promise<void> => {
  await delay(200);
  await ensureSeeded();
  const users = readUsersFromStorage();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) throw new Error("User not found");
  writeUsersToStorage(next);
};