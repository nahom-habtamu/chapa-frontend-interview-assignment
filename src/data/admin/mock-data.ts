import { User } from "../../types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "user",
    isActive: false,
    createdAt: "2024-01-25T09:15:00Z",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-02-01T16:20:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-02-05T11:10:00Z",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "user",
    isActive: false,
    createdAt: "2024-02-10T13:30:00Z",
  },
  {
    id: "7",
    name: "Robert Miller",
    email: "robert.miller@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-02-12T08:45:00Z",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: "user",
    isActive: true,
    createdAt: "2024-02-15T12:00:00Z",
  },
];

export interface UserPaymentSummary {
  userId: string;
  userName: string;
  totalAmount: number;
  currency: string;
  transactionCount: number;
  lastTransactionDate: string;
}

export const mockUserPaymentSummaries: UserPaymentSummary[] = [
  {
    userId: "1",
    userName: "John Doe",
    totalAmount: 15750.00,
    currency: "ETB",
    transactionCount: 12,
    lastTransactionDate: "2024-02-20T14:30:00Z",
  },
  {
    userId: "2",
    userName: "Jane Smith",
    totalAmount: 8250.00,
    currency: "ETB",
    transactionCount: 8,
    lastTransactionDate: "2024-02-19T10:15:00Z",
  },
  {
    userId: "3",
    userName: "Michael Johnson",
    totalAmount: 3400.00,
    currency: "ETB",
    transactionCount: 5,
    lastTransactionDate: "2024-02-10T16:45:00Z",
  },
  {
    userId: "4",
    userName: "Sarah Wilson",
    totalAmount: 22100.00,
    currency: "ETB",
    transactionCount: 18,
    lastTransactionDate: "2024-02-21T09:20:00Z",
  },
  {
    userId: "5",
    userName: "David Brown",
    totalAmount: 6750.00,
    currency: "ETB",
    transactionCount: 7,
    lastTransactionDate: "2024-02-18T15:10:00Z",
  },
  {
    userId: "6",
    userName: "Emily Davis",
    totalAmount: 1200.00,
    currency: "ETB",
    transactionCount: 2,
    lastTransactionDate: "2024-02-05T11:30:00Z",
  },
  {
    userId: "7",
    userName: "Robert Miller",
    totalAmount: 11450.00,
    currency: "ETB",
    transactionCount: 9,
    lastTransactionDate: "2024-02-20T13:45:00Z",
  },
  {
    userId: "8",
    userName: "Lisa Anderson",
    totalAmount: 18900.00,
    currency: "ETB",
    transactionCount: 15,
    lastTransactionDate: "2024-02-21T12:15:00Z",
  },
];