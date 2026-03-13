"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { RoleListItemDto } from "@/types/role";
import { rolesApi } from "@/lib/api/roles";
import RoleSearch from "./RoleSearch";
import RolesTable from "./RolesTable";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import DeleteDialog from "@/components/shared/DeleteDialog";

export default function RolesContent() {
  const pathname = usePathname();

  const [roles, setRoles] = useState<RoleListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleListItemDto | null>(null);
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleListItemDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const locale = pathname.split('/')[1] || 'en';

  // Fetch roles when search or pagination changes
  useEffect(() => {
    let cancelled = false;

    async function fetchRoles() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await rolesApi.getRoles({
          searchTerm: searchTerm || undefined,
          pageNumber,
          pageSize
        });

        if (cancelled) return;

        if (response.succeeded && response.data) {
          setRoles(response.data.items || []);
        } else {
          setError(response.message || 'Failed to fetch roles');
          setRoles([]);
        }
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.response?.data?.message || 'An error occurred while fetching roles');
        setRoles([]);
        console.error('Error fetching roles:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchRoles();

    return () => { cancelled = true; };
  }, [searchTerm, pageNumber, pageSize]);

  const handleEditClick = (role: RoleListItemDto) => {
    setRoleToEdit(role);
    setShowEditModal(true);
  };

  const handleDeleteClick = (role: RoleListItemDto) => {
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await rolesApi.deleteRole(roleToDelete.id);

      if (response.succeeded) {
        // Remove role from the list
        setRoles(prevRoles => prevRoles.filter(role => role.id !== roleToDelete.id));
        setShowDeleteDialog(false);
        setRoleToDelete(null);
      } else {
        setError(response.message || 'Failed to delete role');
        setShowDeleteDialog(false);
        setRoleToDelete(null);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'An error occurred while deleting role';
      setError(errorMessage);
      console.error('Error deleting role:', err);
      setShowDeleteDialog(false);
      setRoleToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
      setRoleToDelete(null);
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSearchTerm('');
    setPageNumber(1);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setRoleToEdit(null);
    // Refresh the list
    setSearchTerm('');
    setPageNumber(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user roles and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Role
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="w-full max-w-md">
          <RoleSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or description..."
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Roles Table */}
      <RolesTable
        roles={roles}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        locale={locale}
      />

      {/* Edit Role Modal */}
      {roleToEdit && (
        <EditRoleModal
          roleId={roleToEdit.id}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setRoleToEdit(null);
          }}
          onSuccess={handleEditSuccess}
          locale={locale}
        />
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        entity={roleToDelete}
        entityType="Role"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        getEntityDisplay={(role) => ({
          title: role.name,
          fields: [
            { label: "Name", value: role.name },
            { label: "Description", value: role.description },
            { label: "Users", value: `${role.numberOfUsers} user${role.numberOfUsers !== 1 ? 's' : ''}` }
          ]
        })}
      />
    </div>
  );
}
