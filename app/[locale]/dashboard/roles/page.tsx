import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import RolesContent from "@/components/features/roles/RolesContent";

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
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  const params = await searchParams;
  const searchTerm = params.search || undefined;
  const pageNumber = parseInt(params.page || '1');
  const pageSize = 20;

  const requestBody = {
    searchTerm,
    pageNumber,
    pageSize
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/paginated`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) redirect("/login");
    throw new Error(`Failed to fetch roles: ${response.status}`);
  }

  const result = await response.json();
  if (!result.succeeded) {
    throw new Error(result.message || 'Failed to fetch roles');
  }

  const rolesData = result.data;

  return (
    <div className="p-6">
      <RolesContent 
        initialRoles={rolesData.items || []}
        initialPagination={rolesData.meta}
        initialFilters={{
          search: params.search || '',
        }}
      />
    </div>
  );
}
