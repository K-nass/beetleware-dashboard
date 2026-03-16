import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import RolesContent from "@/components/features/roles/RolesContent";

export const metadata = {
  title: "Roles & Permissions",
  description: "Manage user roles and their permissions"
};

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function RolesPage({ searchParams }: PageProps) {
  // Get access token from server session
  const token = await getServerAccessToken();
  
  // Redirect if not authenticated
  if (!token) {
    redirect("/login");
  }

  // Extract and parse search parameters
  const searchTerm = searchParams.search || undefined;
  const pageNumber = parseInt(searchParams.page || '1');
  const pageSize = 20;

  // Construct request body for POST endpoint
  const requestBody = {
    searchTerm,
    pageNumber,
    pageSize
  };

  // Fetch roles data
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/paginated`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  });

  // Handle response
  if (!response.ok) {
    if (response.status === 401) {
      redirect("/login");
    }
    throw new Error(`Failed to fetch roles: ${response.status}`);
  }

  const result = await response.json();

  // Extract data from standard response structure
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
          search: searchParams.search || '',
        }}
      />
    </div>
  );
}
