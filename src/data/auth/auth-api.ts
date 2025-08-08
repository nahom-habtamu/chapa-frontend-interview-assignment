import { AuthResponse, LoginCredentials, User } from "./types";

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Jane Smith",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "superadmin@example.com",
    name: "Super Admin",
    role: "super_admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


export const getCurrentUser = async (token: string): Promise<User> => {
  await delay(500);
  const user = decodeToken(token);
  if (!user) {
    throw new Error("Invalid token");
  }
  return user;
};


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  }));
  const signature = btoa("mock-signature");
  return `${header}.${payload}.${signature}`;
};

export const decodeToken = (token: string): User | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: mockUsers.find(u => u.id === payload.sub)?.name || "",
      role: payload.role,
      createdAt: mockUsers.find(u => u.id === payload.sub)?.createdAt || "",
      updatedAt: mockUsers.find(u => u.id === payload.sub)?.updatedAt || "",
    };
  } catch {
    return null;
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1000);
  const user = mockUsers.find(u => u.email === credentials.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const validPasswords: Record<string, string> = {
    "user@example.com": "user123",
    "admin@example.com": "admin123",
    "superadmin@example.com": "super123",
  };

  if (validPasswords[credentials.email] !== credentials.password) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    user,
    token: {
      access_token: token,
      expires_in: 86400, // 24 hours
      token_type: "Bearer",
    },
  };
};

