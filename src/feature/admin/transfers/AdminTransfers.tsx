import { useState } from "react";
import { formatCurrency, formatDate, getStatusColor, useTransferInitiation, useTransfers, useTransferVerification, type TransferInitiateFormData } from "../../../data/admin";
import { useAuth } from "../../../data/auth/use-auth";
import { Button } from "../../../ui/atoms/Button";
import { Icon } from "../../../ui/atoms/Icons";
import { Text } from "../../../ui/atoms/Text";
import { TransferInitiationModal } from "../../../ui/organisms";

interface AdminTransfersProps {
  className?: string;
}

export const AdminTransfers: React.FC<AdminTransfersProps> = ({ className }) => {
  const { isSuperAdmin, hasRole } = useAuth();
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [lastTransferReference, setLastTransferReference] = useState<string>("");

  const { transfers, loading: transfersLoading } = useTransfers();
  const { 
    form, 
    banks, 
    banksLoading, 
    initiateTransfer, 
    isLoading: isInitiating, 
    error: initiateError, 
    resetForm 
  } = useTransferInitiation();
  
  const { 
    verifyTransfer, 
    verifyingReference, 
    verificationResult, 
    clearVerificationResult
  } = useTransferVerification();



  if (!hasRole(["admin", "super_admin"])) {
    return (
      <div className={className}>
        <div className="text-center">
          <Icon name="shield" size="lg" className="text-gray-400 mx-auto mb-4" />
          <Text variant="h6" className="text-gray-500">
            Access Denied
          </Text>
          <Text variant="caption" className="text-gray-400 mt-2">
            You don&apos;t have permission to access this page
          </Text>
        </div>
      </div>
    );
  }

  const handleInitiateTransfer = async (data: TransferInitiateFormData) => {
    try {
      const result = await initiateTransfer(data);
      if (result?.reference) {
        setLastTransferReference(result.reference);
        console.log("Transfer initiated successfully with reference:", result.reference);
      }
      resetForm();
      setIsInitiateModalOpen(false);
    } catch (error) {
      console.error("Transfer initiation failed:", error);
    }
  };

  const handleVerifyTransfer = async (reference: string) => {
    try {
      await verifyTransfer(reference);
    } catch (error) {
      console.error("Transfer verification failed:", error);
    }
  };

  const totalTransfers = transfers.length;
  const completedTransfers = transfers.filter(t => t.status === "completed").length;
  const totalAmount = transfers
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="h3" className="font-bold text-gray-900">
              Transfers
            </Text>
            <Text variant="body" className="text-gray-600 mt-2">
              Initiate transfers and monitor transaction status
            </Text>
          </div>
          <div className="flex space-x-3">
            {isSuperAdmin() && (
              <Button 
                onClick={() => setIsInitiateModalOpen(true)}
                className="flex items-center space-x-2"
                disabled={isInitiating}
              >
                <Icon name="arrowUpRight" size="sm" />
                <span>{isInitiating ? "Processing..." : "Initiate Transfer"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {lastTransferReference && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="checkCircle" size="sm" className="text-green-500 mr-2" />
            <Text variant="body" className="text-green-700">
              Transfer initiated successfully! Reference: <span className="font-mono">{lastTransferReference}</span>
            </Text>
          </div>
        </div>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="search" size="sm" className="text-blue-500 mr-2" />
              <Text variant="body" className="text-blue-700 font-semibold">
                Verification Result
              </Text>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearVerificationResult}
            >
              <Icon name="x" size="sm" />
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <Text variant="caption" className="text-blue-600">Transfer ID:</Text>
              <Text variant="body" className="font-mono text-sm">{verificationResult.transfer_id}</Text>
            </div>
            <div className="flex justify-between">
              <Text variant="caption" className="text-blue-600">Status:</Text>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verificationResult.status)}`}>
                {verificationResult.status}
              </span>
            </div>
            <div className="flex justify-between">
              <Text variant="caption" className="text-blue-600">Amount:</Text>
              <Text variant="body">{formatCurrency(verificationResult.amount, verificationResult.currency)}</Text>
            </div>
            <div className="flex justify-between">
              <Text variant="caption" className="text-blue-600">Recipient:</Text>
              <Text variant="body">{verificationResult.recipient}</Text>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Total Transfers
              </Text>
              <Text variant="h4" className="text-gray-900 font-bold mt-2">
                {transfersLoading ? "..." : totalTransfers}
              </Text>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Icon name="arrowUpRight" size="md" className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Completed
              </Text>
              <Text variant="h4" className="text-green-600 font-bold mt-2">
                {transfersLoading ? "..." : completedTransfers}
              </Text>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <Icon name="checkCircle" size="md" className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Total Amount
              </Text>
              <Text variant="h4" className="text-purple-600 font-bold mt-2">
                {transfersLoading ? "..." : formatCurrency(totalAmount, "ETB")}
              </Text>
            </div>
            <div className="rounded-lg bg-purple-100 p-3">
              <Icon name="dollarSign" size="md" className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <Text variant="h6" className="font-semibold text-gray-900">
            Recent Transfers
          </Text>
          <Text variant="caption" className="text-gray-500 mt-1">
            Monitor transfer transactions and their status
          </Text>
        </div>
        
        {transfersLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <Text variant="body" className="text-gray-600 mt-2">
              Loading transfers...
            </Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transfer ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body" className="font-mono text-sm font-medium text-gray-900">
                        {transfer.id}
                      </Text>
                      <Text variant="caption" className="text-gray-500">
                        {transfer.reference}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body" className="font-medium text-gray-900">
                        {transfer.recipient}
                      </Text>
                      <Text variant="caption" className="text-gray-500">
                        {transfer.bankCode} • {transfer.accountNumber}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body" className="font-semibold text-gray-900">
                        {formatCurrency(transfer.amount, transfer.currency)}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transfer.status)}`}>
                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body" className="text-gray-900">
                        {formatDate(transfer.createdAt)}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyTransfer(transfer.reference)}
                        disabled={verifyingReference === transfer.reference}
                      >
                        {verifyingReference === transfer.reference ? (
                          <>
                            <Icon name="refresh" size="sm" className="mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Initiation Modal */}
      <TransferInitiationModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        onSubmit={handleInitiateTransfer}
        isLoading={isInitiating}
        error={initiateError}
        banks={banks}
        banksLoading={banksLoading}
        form={form}
      />
    </div>
  );
};