import React from "react";
import { useInitializePayment } from "../../data/user/use-initialize-payments";
import { Button } from "../atoms/Button";

import { Dropdown } from "../atoms/Dropdown";
import { Icon } from "../atoms/Icons";
import { Input } from "../atoms/Input";
import { Text } from "../atoms/Text";
import { cn } from "../utils/cn";

interface PaymentFormProps {
  className?: string;
  onSuccess?: () => void;
  currencyOptions?: Array<{ value: string; label: string }>;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  className,
  onSuccess,
  currencyOptions = [
    { value: "ETB", label: "Ethiopian Birr (ETB)" },
    { value: "USD", label: "US Dollar (USD)" },
  ],
}) => {
  const {
    form,
    handleInitializePayment,
    isLoading,
    error,
    isSuccess,
  } = useInitializePayment();

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;



  React.useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
    }
  }, [isSuccess, onSuccess]);

  return (
    <div className={cn(
      "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
      className
    )}>
      <div className="flex items-center mb-6">
        <div className="rounded-full bg-green-100 p-2 mr-3">
          <Icon name="creditCard" size="lg" className="text-green-600" />
        </div>
        <Text variant="h5" className="font-semibold">
          Initialize Payment
        </Text>
      </div>

      <form onSubmit={handleInitializePayment} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...register("customerFirstName")}
            error={errors.customerFirstName?.message}
            placeholder="Enter first name"
          />
          <Input
            label="Last Name"
            {...register("customerLastName")}
            error={errors.customerLastName?.message}
            placeholder="Enter last name"
          />
        </div>

        <Input
          label="Email"
          type="email"
          {...register("customerEmail")}
          error={errors.customerEmail?.message}
          placeholder="Enter email address"
        />

        <Input
          label="Phone Number (Optional)"
          {...register("customerPhone")}
          error={errors.customerPhone?.message}
          placeholder="Enter phone number"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            {...register("amount")}
            error={errors.amount?.message}
            placeholder="0.00"
          />
          <Dropdown
            label="Currency"
            options={currencyOptions}
            value={watch("currency")}
            onChange={(value) => setValue("currency", value as "ETB" | "USD")}
            error={errors.currency?.message}
          />
        </div>

        <Input
          label="Description (Optional)"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Payment description"
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

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
            size="lg"
          >
            {isLoading && <Icon name="refresh" size="sm" className="mr-2 animate-spin" />}
            {isLoading ? "Processing..." : "Initialize Payment"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
            size="lg"
          >
            Clear
          </Button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <Text variant="caption" className="text-blue-800">
          <Icon name="shield" size="sm" className="inline mr-2" />
          This will redirect you to Chapa&apos;s secure payment page to complete the transaction.
        </Text>
      </div>
    </div>
  );
};