"use client";

import { useState } from "react";

interface UserStatusToggleProps {
  userId: number;
  isActive: boolean;
  onToggle: (userId: number) => void;
}

export default function UserStatusToggle({ userId, isActive, onToggle }: UserStatusToggleProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(userId);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`
        relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isActive ? 'bg-green-500' : 'bg-gray-300'}
        ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
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
  );
}

