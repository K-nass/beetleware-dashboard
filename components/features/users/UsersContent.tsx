"use client";

import { useState } from "react";
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

  const [users, setUsers] = useState<UserListItem[]>(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'internal' | 'external'>(initialFilters.userType);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTabChange = (newUserType: 'internal' | 'external') => {
    setUserType(newUserType);
    updateSearchParams({ userType: newUserType, page: null });
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
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

      <div className="flex justify-between items-center">
        <div className="w-full max-w-md">
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
            <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
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
