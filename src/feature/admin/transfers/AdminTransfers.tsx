import { useState } from "react";
import { useCheckTransferStatus, useInitiateTransfer, useTransfers, type TransferStatusResponse } from "../../../data/admin";
import { useAuth } from "../../../data/auth/use-auth";
import { Button } from "../../../ui/atoms/Button";
import { Icon } from "../../../ui/atoms/Icons";
import { Input } from "../../../ui/atoms/Input";
import { Text } from "../../../ui/atoms/Text";
import { BaseModal } from "../../../ui/molecules";

interface AdminTransfersProps {
  className?: string;
}

export const AdminTransfers: React.FC<AdminTransfersProps> = ({ className }) => {
  const { isSuperAdmin, hasRole } = useAuth();
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [transferId, setTransferId] = useState("");
  const [statusResult, setStatusResult] = useState<TransferStatusResponse | { error: string } | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    currency: "ETB",
    recipient: "",
    accountNumber: "",
    bankCode: "",
    reason: "",
  });

  const { transfers, loading: transfersLoading } = useTransfers();
  const initiateMutation = useInitiateTransfer();
  const statusMutation = useCheckTransferStatus();

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

  const handleInitiateTransfer = async () => {
    if (!formData.amount || !formData.recipient || !formData.accountNumber) return;

    try {
      await initiateMutation.mutateAsync({
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        recipient: formData.recipient,
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode,
        reason: formData.reason,
      });

      setFormData({
        amount: "",
        currency: "ETB",
        recipient: "",
        accountNumber: "",
        bankCode: "",
        reason: "",
      });
      setIsInitiateModalOpen(false);
    } catch (error) {
      console.error("Transfer initiation failed:", error);
    }
  };

  const handleCheckStatus = async () => {
    if (!transferId) return;

    try {
      const result = await statusMutation.mutateAsync(transferId);
      setStatusResult(result);
    } catch (error) {
      setStatusResult({ error: error instanceof Error ? error.message : "Failed to check status" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "ETB" ? "ETB" : "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
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
            <Text variant="h2" className="text-gray-900 font-bold">
              Transfer Management
            </Text>
            <Text variant="body" className="text-gray-600 mt-2">
              Initiate transfers and monitor transaction status
            </Text>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => setIsStatusModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Icon name="search" size="sm" />
              <span>Check Status</span>
            </Button>
            {isSuperAdmin() && (
              <Button 
                onClick={() => setIsInitiateModalOpen(true)}
                className="flex items-center space-x-2"
                disabled={initiateMutation.isPending}
              >
                <Icon name="arrowUpRight" size="sm" />
                <span>{initiateMutation.isPending ? "Processing..." : "Initiate Transfer"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

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
              <thead className="bg-gray-50/80">
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
                        onClick={() => {
                          setTransferId(transfer.id);
                          setIsStatusModalOpen(true);
                        }}
                      >
                        Check Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Initiate Transfer Modal */}
      <BaseModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        title="Initiate Transfer"
        headerIcon="arrowUpRight"
        size="lg"
        actions={
          <>
            <Button variant="outline" onClick={() => setIsInitiateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInitiateTransfer} disabled={initiateMutation.isPending}>
              {initiateMutation.isPending ? "Processing..." : "Initiate Transfer"}
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
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              placeholder="Enter recipient name"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <Input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              placeholder="Enter account number"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Code
            </label>
            <Input
              type="text"
              value={formData.bankCode}
              onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
              placeholder="e.g., CBE, DASH, BOA"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Reason
            </label>
            <Input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Enter transfer reason"
              className="w-full"
            />
          </div>
        </div>

        {initiateMutation.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text variant="caption" className="text-red-600">
              {initiateMutation.error.message}
            </Text>
          </div>
        )}
      </BaseModal>

      {/* Status Check Modal */}
      <BaseModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setStatusResult(null);
          setTransferId("");
        }}
        title="Check Transfer Status"
        headerIcon="search"
        size="md"
        actions={
          <Button variant="outline" onClick={() => {
            setIsStatusModalOpen(false);
            setStatusResult(null);
            setTransferId("");
          }}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer ID
            </label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={transferId}
                onChange={(e) => setTransferId(e.target.value)}
                placeholder="Enter transfer ID"
                className="flex-1"
              />
              <Button 
                onClick={handleCheckStatus} 
                disabled={statusMutation.isPending || !transferId}
                size="sm"
              >
                {statusMutation.isPending ? "Checking..." : "Check"}
              </Button>
            </div>
          </div>
          
          {statusMutation.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text variant="caption" className="text-red-600">
                {statusMutation.error.message}
              </Text>
            </div>
          )}

          {statusResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <Text variant="h6" className="font-semibold text-gray-900 mb-3">
                Status Result
              </Text>
              {"error" in statusResult ? (
                <Text variant="body" className="text-red-600">
                  {statusResult.error}
                </Text>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text variant="caption" className="text-gray-500">Transfer ID:</Text>
                    <Text variant="body" className="font-mono text-sm">{statusResult.transfer_id}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text variant="caption" className="text-gray-500">Status:</Text>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(statusResult.status)}`}>
                      {statusResult.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <Text variant="caption" className="text-gray-500">Amount:</Text>
                    <Text variant="body">{formatCurrency(statusResult.amount, statusResult.currency)}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text variant="caption" className="text-gray-500">Recipient:</Text>
                    <Text variant="body">{statusResult.recipient}</Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </BaseModal>
    </div>
  );
};