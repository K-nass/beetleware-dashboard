"use client";

import PermissionBadge from "./PermissionBadge";

interface PermissionsGroupProps {
  pageName: string;
  permissions: string[];
  variant?: 'card' | 'detail';
}

export default function PermissionsGroup({ 
  pageName, 
  permissions, 
  variant = 'card' 
}: PermissionsGroupProps) {
  if (variant === 'detail') {
    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{pageName}</h4>
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission, index) => (
            <PermissionBadge key={index} permission={permission} variant="default" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500">{pageName}</p>
      <div className="flex flex-wrap gap-1">
        {permissions.map((permission, index) => (
          <PermissionBadge key={index} permission={permission} variant="compact" />
        ))}
      </div>
    </div>
  );
}
