"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") || "").toLowerCase();
  const txRef = searchParams.get("tx_ref") || searchParams.get("txRef") || "";
  const reference = searchParams.get("reference") || "";
  const message = searchParams.get("message") || "";

  const isSuccess = status.includes("success");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-md">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isSuccess ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-7 w-7 ${isSuccess ? "text-green-600" : "text-yellow-600"}`}
          >
            {isSuccess ? (
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            ) : (
              <circle cx="12" cy="12" r="10" />
            )}
            {isSuccess ? (
              <polyline points="22 4 12 14.01 9 11.01" />
            ) : (
              <line x1="12" y1="8" x2="12" y2="12" />
            )}
          </svg>
        </div>

        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-900">
          {isSuccess ? "Payment Successful" : "Payment Returned"}
        </h1>
        <p className="mb-6 text-center text-gray-600">
          {message ||
            (isSuccess
              ? "Your payment was completed successfully. You can review the details below."
              : "You have been redirected back from checkout. If this was unintentional, you can try again.")}
        </p>

        <div className="mb-6 space-y-2">
          {txRef && (
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
              <span className="text-gray-600">Transaction Ref</span>
              <code className="font-mono text-gray-900">{txRef}</code>
            </div>
          )}
          {reference && (
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
              <span className="text-gray-600">Reference</span>
              <code className="font-mono text-gray-900">{reference}</code>
            </div>
          )}
          {status && (
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${isSuccess ? "text-green-700" : "text-yellow-700"}`}>
                {status}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/user/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/user/transactions"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
}


