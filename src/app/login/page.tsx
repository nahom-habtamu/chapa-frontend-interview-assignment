"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "../../feature/auth/login";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-8">Chapa Pay</h1>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">
          <LoginForm onSuccess={() => router.push("/")} />
        </div>
      </div>
    </div>
  );
}