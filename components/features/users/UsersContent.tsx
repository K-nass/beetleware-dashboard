"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserListItem, UserTypeEnum } from "@/types/user";
import { usersApi } from "@/lib/api/users";
import UserTabs from "./UserTabs";
import UserSearch from "./UserSearch";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import DeleteDialog from "@/components/shared/DeleteDialog";

export default function UsersContent() {
  const pathname = usePathname();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userType, setUserType] = useState<'internal' | 'external'>('internal');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const locale = pathname.split('/')[1] || 'en';

  // Check for hash to open add modal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#add-user') {
        setShowAddModal(true);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch users when tab or search changes
  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await usersApi.getUsers({
          searchTerm: searchTerm || undefined,
          userType: userType === 'internal' ? UserTypeEnum.Internal : UserTypeEnum.External
        });

        if (cancelled) return;

        if (response.succeeded && response.data) {
          const usersWithType = (response.data.items || []).map(user => ({
            ...user,
            userType: userType === 'internal' ? UserTypeEnum.Internal : UserTypeEnum.External
          }));
          setUsers(usersWithType);
        } else {
          setError(response.message || 'Failed to fetch users');
          setUsers([]);
        }
      } catch (err) {
        if (cancelled) return;
        setError('An error occurred while fetching users');
        setUsers([]);
        console.error('Error fetching users:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchUsers();

    return () => { cancelled = true; };
  }, [userType, searchTerm]);

  const handleToggleStatus = async (userId: number) => {
    try {
      const response = await usersApi.toggleUserStatus(userId);

      if (response.succeeded) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, isActive: !user.isActive } : user
          )
        );
      } else {
        setError(response.message || 'Failed to toggle user status');
      }
    } catch (err) {
      setError('An error occurred while toggling user status');
      console.error('Error toggling user status:', err);
    }
  };

  const handleDeleteClick = (user: UserListItem) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await usersApi.deleteUser(userToDelete.id);

      if (response.succeeded) {
        // Remove user from the list
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        setShowDeleteDialog(false);
        setUserToDelete(null);
      } else {
        setError(response.message || 'Failed to delete user');
        setShowDeleteDialog(false);
        setUserToDelete(null);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'An error occurred while deleting user';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      console.error('Error response:', err?.response?.data);
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <UserTabs
        activeTab={userType}
        onTabChange={setUserType}
        internalCount={userType === 'internal' ? users.length : undefined}
        externalCount={userType === 'external' ? users.length : undefined}
      />

      <div className="flex justify-between items-center">
        <div className="w-full max-w-md">
          <UserSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or email..."
          />
        </div>
      </div>

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

      <UsersTable
        users={users}
        isLoading={isLoading}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setSearchTerm('');
          setUserType('internal');
        }}
        locale={locale}
      />

      <DeleteDialog
        isOpen={showDeleteDialog}
        entity={userToDelete}
        entityType="User"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        getEntityDisplay={(user) => ({
          title: user.fullName,
          fields: [
            { label: "Name", value: user.fullName },
            { label: "Email", value: user.email },
            ...(user.phoneNumber ? [{ label: "Phone", value: user.phoneNumber }] : [])
          ]
        })}
      />
    </div>
  );
}


