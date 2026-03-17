"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";
import { RoleListItemDto } from "@/types/role";
import RoleSearch from "./RoleSearch";
import RolesTable from "./RolesTable";

interface RolesContentProps {
  initialRoles: RoleListItemDto[];
  initialPagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  initialFilters: {
    search: string;
  };
}

export default function RolesContent({ initialRoles, initialPagination, initialFilters }: RolesContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [roles, setRoles] = useState<RoleListItemDto[]>(initialRoles);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    updateSearchParams({ search: newSearchTerm, page: null });
  };

  const handleEditClick = (role: RoleListItemDto) => {
    router.push(`${pathname}/edit/${role.id}`);
  };

  const handleDeleteClick = (role: RoleListItemDto) => {
    router.push(`${pathname}/delete/${role.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user roles and their permissions</p>
        </div>
        <Link
          href={`${pathname}/add`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Role
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-full max-w-md">
          <RoleSearch
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or description..."
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

      <RolesTable
        roles={roles}
        isLoading={false}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

    </div>
  );
}
