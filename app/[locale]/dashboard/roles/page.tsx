import RolesContent from "@/components/features/roles/RolesContent";
import { fetchApi } from "@/lib/api/fetch-api";
import { PaginatedRolesResponse } from "@/types/role";

export const metadata = {
  title: "Roles & Permissions",
  description: "Manage user roles and their permissions"
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function RolesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchTerm = params.search || undefined;
  const pageNumber = parseInt(params.page || '1');
  const pageSize = 20;

  const requestBody = {
    searchTerm,
    pageNumber,
    pageSize
  };

  const rolesData = await fetchApi<PaginatedRolesResponse>('/roles/paginated', {
    method: 'POST',
    body: requestBody,
    noStore: true,
  });

  return (
    <div className="p-6">
      <RolesContent 
        initialRoles={rolesData.items || []}
        initialPagination={{
          pageNumber: rolesData.pageNumber,
          pageSize: rolesData.pageSize,
          totalCount: rolesData.totalCount,
          totalPages: rolesData.totalPages,
        }}
        initialFilters={{
          search: params.search || '',
        }}
      />
    </div>
  );
}
