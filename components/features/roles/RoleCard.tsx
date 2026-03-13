"use client";

import { Edit2, Trash2, Users, Shield } from "lucide-react";
import { RoleListItemDto } from "@/types/role";
import PermissionBadge from "./PermissionBadge";

interface RoleCardProps {
  role: RoleListItemDto;
  onEdit: (role: RoleListItemDto) => void;
  onDelete: (role: RoleListItemDto) => void;
  onToggleStatus?: (roleId: number) => void;
}

export default function RoleCard({ role, onEdit, onDelete, onToggleStatus }: RoleCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{role.name}</h3>
            <p className="text-sm text-gray-500">{role.description}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit role"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(role)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete role"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Status and User Count */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {role.numberOfUsers} {role.numberOfUsers === 1 ? 'User' : 'Users'}
          </span>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              role.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {role.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Permissions */}
      {role.permissions && role.permissions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Permissions</p>
          <div className="flex flex-wrap gap-1">
            {role.permissions.slice(0, 5).map((permission, index) => (
              <PermissionBadge key={index} permission={permission} variant="compact" />
            ))}
            {role.permissions.length > 5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                +{role.permissions.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created by {role.createdBy}</span>
          <span>{new Date(role.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
