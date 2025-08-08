import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdmins } from "../../../data/admin";
import { useAuth } from "../../../data/auth/use-auth";
import { Button } from "../../../ui/atoms/Button";
import { Icon } from "../../../ui/atoms/Icons";
import { Input } from "../../../ui/atoms/Input";
import { Text } from "../../../ui/atoms/Text";
import { BaseModal } from "../../../ui/molecules";

interface ManageAdminsProps {
  className?: string;
}

export const ManageAdmins: React.FC<ManageAdminsProps> = ({ className }) => {
  const { isSuperAdmin } = useAuth();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  const { 
    admins, 
    loading, 
    createAdmin, 
    deactivateAdmin, 
    reactivateAdmin, 
    deleteAdmin,
    isCreating,
    isDeactivating,
    isReactivating,
    isDeleting
  } = useAdmins();

  if (!isSuperAdmin()) {
    router.push("/admin/dashboard");
    return null;
  }

  const handleAddAdmin = () => {
    if (formData.name && formData.email) {
      createAdmin({
        name: formData.name,
        email: formData.email,
        role: formData.role as "admin" | "super_admin",
        isActive: true,
        isDeactivated: false,
      });
      setFormData({ name: "", email: "", role: "admin" });
      setIsAddModalOpen(false);
    }
  };

  const toggleAdminStatus = (adminId: string, isCurrentlyActive: boolean) => {
    if (isCurrentlyActive) {
      deactivateAdmin(adminId);
    } else {
      reactivateAdmin(adminId);
    }
  };

  const removeAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to permanently delete this admin? This action cannot be undone.")) {
      deleteAdmin(adminId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const activeAdmins = admins.filter(admin => admin.isActive && !admin.isDeactivated).length;
  const superAdmins = admins.filter(admin => admin.role === "super_admin").length;

  if (loading) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <Text variant="body" className="text-gray-600 mt-4">
            Loading administrators...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="h2" className="text-gray-900 font-bold">
              Manage Administrators
            </Text>
            <Text variant="body" className="text-gray-600 mt-2">
              Add, remove, and manage admin user accounts
            </Text>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2"
            disabled={isCreating}
          >
            <Icon name="userPlus" size="sm" />
            <span>{isCreating ? "Creating..." : "Add Admin"}</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Total Admins
              </Text>
              <Text variant="h4" className="text-gray-900 font-bold mt-2">
                {admins.length}
              </Text>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Icon name="shield" size="md" className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Active Admins
              </Text>
              <Text variant="h4" className="text-green-600 font-bold mt-2">
                {activeAdmins}
              </Text>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <Icon name="userCheck" size="md" className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="caption" className="text-gray-500 font-medium">
                Super Admins
              </Text>
              <Text variant="h4" className="text-purple-600 font-bold mt-2">
                {superAdmins}
              </Text>
            </div>
            <div className="rounded-lg bg-purple-100 p-3">
              <Icon name="crown" size="md" className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <Text variant="h6" className="font-semibold text-gray-900">
            Administrator Accounts
          </Text>
          <Text variant="caption" className="text-gray-500 mt-1">
            Manage admin user permissions and access
          </Text>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrator
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <Text variant="body" className="text-white font-semibold text-sm">
                          {admin.name.charAt(0).toUpperCase()}
                        </Text>
                      </div>
                      <div className="ml-4">
                        <Text variant="body" className="font-medium text-gray-900">
                          {admin.name}
                        </Text>
                        <Text variant="caption" className="text-gray-500">
                          {admin.email}
                        </Text>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      admin.role === "super_admin" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      admin.isActive && !admin.isDeactivated
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {admin.isActive && !admin.isDeactivated ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text variant="body" className="text-gray-900">
                      {formatDate(admin.createdAt)}
                    </Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAdminStatus(admin.id, admin.isActive && !admin.isDeactivated)}
                        disabled={isDeactivating || isReactivating}
                      >
                        {admin.isActive && !admin.isDeactivated ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdmin(admin.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        disabled={isDeleting}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      <BaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Administrator"
        headerIcon="userPlus"
        size="md"
        actions={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} disabled={isCreating}>
              {isCreating ? "Creating..." : "Add Admin"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              className="w-full"
            />
          </div>
          
          
        </div>
      </BaseModal>
    </div>
  );
};