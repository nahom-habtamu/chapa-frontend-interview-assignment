import { BaseUser } from "./types";

export const mockUsers: BaseUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-01-20T14:45:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "user",
    isActive: false,
    isDeactivated: true, 
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "user",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-02-01T16:20:00Z",
    updatedAt: "2024-02-01T16:20:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "user",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-02-05T11:10:00Z",
    updatedAt: "2024-02-05T11:10:00Z",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "user",
    isActive: false,
    isDeactivated: true,
    createdAt: "2024-02-10T13:30:00Z",
    updatedAt: "2024-02-12T09:00:00Z",
  },
  {
    id: "7",
    name: "Robert Miller",
    email: "robert.miller@example.com",
    role: "user",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-02-12T08:45:00Z",
    updatedAt: "2024-02-12T08:45:00Z",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: "user",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-02-15T12:00:00Z",
    updatedAt: "2024-02-15T12:00:00Z",
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@chapa.co",
    role: "admin",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "super1",
    name: "Super Admin",
    email: "superadmin@chapa.co",
    role: "super_admin",
    isActive: true,
    isDeactivated: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const mockAdmins: BaseUser[] = mockUsers.filter(user =>
  user.role === "admin" || user.role === "super_admin"
);

export const mockRegularUsers: BaseUser[] = mockUsers.filter(user =>
  user.role === "user"
);