"use client";

import { RoleListItemDto } from "@/types/role";
import { FileText } from "lucide-react";
import RoleCard from "./RoleCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface RolesTableProps {
  roles: RoleListItemDto[];
  isLoading: boolean;
  onEdit: (role: RoleListItemDto) => void;
  onDelete: (role: RoleListItemDto) => void;
  onToggleStatus?: (roleId: number) => void;
}

export default function RolesTable({
  roles,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus
}: RolesTableProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new role.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
