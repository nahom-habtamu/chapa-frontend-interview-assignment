import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TransferInitiateFormData } from "../../data/admin";
import { Button } from "../atoms/Button";
import { Dropdown } from "../atoms/Dropdown";
import { Input } from "../atoms/Input";
import { Text } from "../atoms/Text";
import { BaseModal } from "../molecules";

interface TransferInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransferInitiateFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
  banks: Array<{ id: number; name: string }>;
  banksLoading: boolean;
  form: UseFormReturn<TransferInitiateFormData>;
}

export const TransferInitiationModal: React.FC<TransferInitiationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  banks,
  banksLoading,
  form,
}) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Transfer"
      headerIcon="arrowUpRight"
      size="lg"
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? "Processing..." : "Initiate Transfer"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <Input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            error={errors.amount?.message}
            placeholder="1"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            {...register("currency")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ETB">ETB</option>
            <option value="USD">USD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Name
          </label>
          <Input
            type="text"
            {...register("recipient")}
            error={errors.recipient?.message}
            placeholder="Abebe"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <Input
            type="text"
            {...register("accountNumber")}
            error={errors.accountNumber?.message}
            placeholder="1000472713888"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank
          </label>
          <Dropdown
            options={banks.map(bank => ({
              value: bank.id.toString(),
              label: bank.name
            }))}
            value={watch("bankId")}
            onChange={(value) => setValue("bankId", value)}
            placeholder="Select a bank"
            disabled={banksLoading}
            error={errors.bankId?.message}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transfer Reason
          </label>
          <Input
            type="text"
            {...register("reason")}
            error={errors.reason?.message}
            placeholder="Test"
            className="w-full"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text variant="caption" className="text-red-600">
            {error}
          </Text>
        </div>
      )}
    </BaseModal>
  );
}; 