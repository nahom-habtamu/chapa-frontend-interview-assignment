import { ChapaVerifyResponse } from "@/data/payment";
import React from "react";
import { useVerifyTransaction } from "../../data/payment/use-payment";
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
    data,
  } = useVerifyTransaction();

  const {
    register,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (isSuccess && data) {
      onSuccess?.(data);
    }
  }, [isSuccess, data, onSuccess]);

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
          {...register("tx_ref")}
          error={errors.tx_ref?.message}
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

      {isSuccess && data && (
        <div className="mt-6 space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <Text variant="h6" className="mb-4">
              Transaction Details
            </Text>
          </div>

          <div className={cn(
            "rounded-md border p-4",
            getStatusColor(data.data.status)
          )}>
            <div className="flex items-center">
              <Icon 
                name={getStatusIcon(data.data.status) as IconName} 
                size="sm" 
                className="mr-2" 
              />
              <Text variant="body" className="font-medium">
                Status: {data.data.status.charAt(0).toUpperCase() + data.data.status.slice(1)}
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Text variant="caption" className="text-gray-500">
                Amount
              </Text>
              <Text variant="body" className="font-medium">
                {data.data.currency} {data.data.amount}
              </Text>
            </div>
            <div className="space-y-2">
              <Text variant="caption" className="text-gray-500">
                Reference
              </Text>
              <Text variant="body" className="font-medium">
                {data.data.reference}
              </Text>
            </div>
            <div className="space-y-2">
              <Text variant="caption" className="text-gray-500">
                Customer
              </Text>
              <Text variant="body" className="font-medium">
                {data.data.first_name} {data.data.last_name}
              </Text>
            </div>
            <div className="space-y-2">
              <Text variant="caption" className="text-gray-500">
                Payment Method
              </Text>
              <Text variant="body" className="font-medium">
                {data.data.method || "N/A"}
              </Text>
            </div>
            <div className="space-y-2">
              <Text variant="caption" className="text-gray-500">
                Created At
              </Text>
              <Text variant="body" className="font-medium">
                {new Date(data.data.created_at).toLocaleDateString()}
              </Text>
            </div>
            <div className="space-y-2">
              <Text variant="caption" className="text-gray-500">
                Mode
              </Text>
              <Text variant="body" className="font-medium">
                {data.data.mode}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};