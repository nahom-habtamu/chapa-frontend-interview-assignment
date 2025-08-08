import React from "react";
import { ChapaVerifyResponse, useVerifyTransaction } from "../../data/user/useVerifyTransaction";
import { Button } from "../atoms/Button";
import { Icon, IconName } from "../atoms/Icons";
import { Input } from "../atoms/Input";
import { Text } from "../atoms/Text";
import { cn } from "../utils/cn";

interface VerifyTransactionFormProps {
  className?: string;
  onSuccess?: (data: ChapaVerifyResponse) => void;
}

export const VerifyTransactionForm: React.FC<VerifyTransactionFormProps> = ({
  className,
  onSuccess,
}) => {
  const {
    form,
    handleVerifyTransaction,
    isLoading,
    error,
    isSuccess,
    result,
  } = useVerifyTransaction();

  const {
    register,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (isSuccess && result?.isValid && result.transaction) {
      // Create a mock ChapaVerifyResponse for onSuccess callback
      const mockResponse: ChapaVerifyResponse = {
        message: "Transaction verified successfully",
        status: "success",
        data: {
          first_name: result.transaction.customerName.split(' ')[0] || "",
          last_name: result.transaction.customerName.split(' ')[1] || "",
          email: result.transaction.customerEmail,
          currency: result.transaction.currency,
          amount: result.transaction.amount,
          charge: 0,
          mode: "test",
          method: "bank_transfer",
          type: "payment",
          status: result.transaction.status,
          reference: result.transaction.reference,
          tx_ref: result.transaction.id,
          customization: {
            title: "Payment",
            description: "Transaction verified",
            logo: "",
          },
          meta: {},
          created_at: result.transaction.createdAt,
          updated_at: result.transaction.updatedAt,
        },
      };
      onSuccess?.(mockResponse);
    }
  }, [isSuccess, result, onSuccess]);

  const getStatusColor = (status: string) => {
    const colors = {
      success: "text-green-600 bg-green-50 border-green-200",
      failed: "text-red-600 bg-red-50 border-red-200",
      pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      success: "check",
      failed: "x",
      pending: "clock",
    };
    return icons[status as keyof typeof icons] || "clock";
  };

  return (
    <div className={cn(
      "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
      className
    )}>
      <div className="flex items-center mb-6">
        <div className="rounded-full bg-purple-100 p-2 mr-3">
          <Icon name="search" size="lg" className="text-purple-600" />
        </div>
        <Text variant="h5" className="font-semibold">
          Verify Transaction
        </Text>
      </div>

      <form onSubmit={handleVerifyTransaction} className="space-y-4">
        <Input
          label="Transaction Reference"
          {...register("txRef")}
          error={errors.txRef?.message}
          placeholder="Enter transaction reference (tx_ref)"
          helperText="This is the reference you received when initializing the payment"
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <Icon name="alertCircle" size="sm" className="text-red-400 mr-3 mt-0.5" />
              <Text variant="caption" className="text-red-800">
                {error}
              </Text>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading && <Icon name="refresh" size="sm" className="mr-2 animate-spin" />}
          {isLoading ? "Verifying..." : "Verify Transaction"}
        </Button>
      </form>

      {isSuccess && result && (
        <div className="mt-6 space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <Text variant="h6" className="mb-4">
              Verification Result
            </Text>
          </div>

          {result.isValid && result.transaction ? (
            <>
              <div className={cn(
                "rounded-md border p-4",
                getStatusColor(result.transaction.status)
              )}>
                <div className="flex items-center">
                  <Icon 
                    name={getStatusIcon(result.transaction.status) as IconName} 
                    size="sm" 
                    className="mr-2" 
                  />
                  <Text variant="body" className="font-medium">
                    Status: {result.transaction.status.charAt(0).toUpperCase() + result.transaction.status.slice(1)}
                  </Text>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Text variant="caption" className="text-gray-500">
                    Amount
                  </Text>
                  <Text variant="body" className="font-medium">
                    {result.transaction.currency} {result.transaction.amount}
                  </Text>
                </div>
                <div className="space-y-2">
                  <Text variant="caption" className="text-gray-500">
                    Reference
                  </Text>
                  <Text variant="body" className="font-medium">
                    {result.transaction.reference}
                  </Text>
                </div>
                <div className="space-y-2">
                  <Text variant="caption" className="text-gray-500">
                    Customer
                  </Text>
                  <Text variant="body" className="font-medium">
                    {result.transaction.customerName}
                  </Text>
                </div>
                <div className="space-y-2">
                  <Text variant="caption" className="text-gray-500">
                    Email
                  </Text>
                  <Text variant="body" className="font-medium">
                    {result.transaction.customerEmail}
                  </Text>
                </div>
                <div className="space-y-2">
                  <Text variant="caption" className="text-gray-500">
                    Created At
                  </Text>
                  <Text variant="body" className="font-medium">
                    {new Date(result.transaction.createdAt).toLocaleDateString()}
                  </Text>
                </div>
                <div className="space-y-2">
                  <Text variant="caption" className="text-gray-500">
                    Transaction ID
                  </Text>
                  <Text variant="body" className="font-medium">
                    {result.transaction.id}
                  </Text>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <Icon name="alertCircle" size="sm" className="text-red-400 mr-3 mt-0.5" />
                <Text variant="caption" className="text-red-800">
                  {result.error || "Transaction verification failed"}
                </Text>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};