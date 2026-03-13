"use client";

interface PermissionBadgeProps {
  permission: string;
  variant?: 'default' | 'compact';
}

// Helper function to format permission names
function formatPermissionName(permission: string): string {
  // Convert camelCase or snake_case to human-readable format
  return permission
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function PermissionBadge({ permission, variant = 'default' }: PermissionBadgeProps) {
  const formattedName = formatPermissionName(permission);
  
  if (variant === 'compact') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        {formattedName}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
      {formattedName}
    </span>
  );
}
