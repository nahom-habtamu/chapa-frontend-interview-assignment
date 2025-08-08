import { useState } from "react";
import { User } from "../../types/user";
import { mockUserPaymentSummaries, mockUsers, UserPaymentSummary } from "./mock-data";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  const toggleUserStatus = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, isActive: !user.isActive }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    toggleUserStatus,
  };
};

export const useUserPaymentSummaries = () => {
  const [paymentSummaries] = useState<UserPaymentSummary[]>(mockUserPaymentSummaries);
  const [loading] = useState(false);

  return {
    paymentSummaries,
    loading,
  };
};