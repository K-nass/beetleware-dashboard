"use client";

import { useTransition, useState } from "react";
import { toggleUserStatus } from "@/app/actions/users";

interface UserStatusToggleProps {
  userId: number;
  isActive: boolean;
}

export default function UserStatusToggle({ userId, isActive }: UserStatusToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleUserStatus(userId);
      if (!result.success) {
        setError(result.error ?? "An error occurred");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`
          relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${isActive ? 'bg-green-500' : 'bg-gray-300'}
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block w-4 h-4 transform bg-white rounded-full transition-transform
            ${isActive ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
        <span className="sr-only">{isActive ? 'Active' : 'Inactive'}</span>
      </button>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded text-xs max-w-[160px]">
          {error}
        </div>
      )}
    </div>
  );
}
