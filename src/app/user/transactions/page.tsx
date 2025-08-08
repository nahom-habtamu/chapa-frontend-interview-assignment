"use client";

import { UserTransactions } from "../../../feature/user/transactions";

export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <UserTransactions />
    </div>
  );
}