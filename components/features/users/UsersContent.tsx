"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserListItem } from "@/types/user";
import UserTabs from "./UserTabs";
import UserSearch from "./UserSearch";
import UsersTable from "./UsersTable";

interface UsersContentProps {
  initialUsers: UserListItem[];
  initialPagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  initialFilters: {
    search: string;
    userType: 'internal' | 'external';
  };
}

export default function UsersContent({ initialUsers, initialFilters }: UsersContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userType = initialFilters.userType;
  const searchTerm = initialFilters.search;
  const users = initialUsers;
  const [error, setError] = useState<string | null>(null);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTabChange = (newUserType: 'internal' | 'external') => {
    updateSearchParams({ userType: newUserType, page: null });
  };

  const handleSearchChange = (newSearchTerm: string) => {
    updateSearchParams({ search: newSearchTerm, page: null });
  };

  const handleDeleteClick = (user: UserListItem) => {
    router.push(`${pathname}/delete/${user.id}`);
  };

  return (
    <div className="space-y-6">
      <UserTabs
        activeTab={userType}
        onTabChange={handleTabChange}
        internalCount={userType === 'internal' ? users.length : undefined}
        externalCount={userType === 'external' ? users.length : undefined}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="w-full sm:max-w-md">
          <UserSearch
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <X className="h-6 w-6 text-red-500" />
          </button>
        </div>
      )}

      <UsersTable
        users={users}
        isLoading={false}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}
