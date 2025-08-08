import { BaseUser } from "../../common/types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async (): Promise<BaseUser[]> => {
  await delay(600);
  const { mockRegularUsers } = await import("../../common/mock-data");
  return mockRegularUsers;
};



export const toggleUserStatus = async (id: string): Promise<BaseUser> => {
  await delay(500);
  const { mockRegularUsers } = await import("../../common/mock-data");
  const user = mockRegularUsers.find(u => u.id === id);

  if (!user) {
    throw new Error("User not found");
  }

  return { ...user, isActive: !user.isActive };
};

export const deactivateUser = async (id: string): Promise<BaseUser> => {
  await delay(500);
  const { mockRegularUsers } = await import("../../common/mock-data");
  const user = mockRegularUsers.find(u => u.id === id);

  if (!user) {
    throw new Error("User not found");
  }

  return { ...user, isDeactivated: true };
};

export const reactivateUser = async (id: string): Promise<BaseUser> => {
  await delay(500);
  const { mockRegularUsers } = await import("../../common/mock-data");
  const user = mockRegularUsers.find(u => u.id === id);

  if (!user) {
    throw new Error("User not found");
  }

  return { ...user, isDeactivated: false };
};

export const deleteUser = async (id: string): Promise<void> => {
  await delay(600);
  const { mockRegularUsers } = await import("../../common/mock-data");
  const user = mockRegularUsers.find(u => u.id === id);

  if (!user) {
    throw new Error("User not found");
  }
};