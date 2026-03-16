import { Suspense } from "react";
import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import PageHeader from "@/components/features/dashboard/pageHeader/PageHeader";
import UsersContent from "@/components/features/users/UsersContent";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    userType?: string;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  const params = await searchParams;
  const searchTerm = params.search || undefined;
  const userType = params.userType || 'internal';
  const pageNumber = parseInt(params.page || '1');
  const pageSize = 20;

  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
    userType: userType === 'internal' ? '1' : '2',
    ...(searchTerm && { searchTerm }),
  });

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/paginated?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) redirect("/login");
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  const result = await response.json();
  if (!result.succeeded) {
    throw new Error(result.message || 'Failed to fetch users');
  }

  const usersData = result.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage internal and external users"
        buttonText="Add User"
        buttonHref="#add-user"
      />

      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Loading users...</div>
        </div>
      }>
        <UsersContent
          initialUsers={usersData.items || []}
          initialPagination={usersData.meta}
          initialFilters={{
            search: params.search || '',
            userType: userType as 'internal' | 'external',
          }}
        />
      </Suspense>
    </div>
  );
}
