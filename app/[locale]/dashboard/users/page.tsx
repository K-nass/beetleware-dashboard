import { Suspense } from "react";
import PageHeader from "@/components/features/dashboard/pageHeader/PageHeader";
import UsersContent from "@/components/features/users/UsersContent";
import { fetchApi } from "@/lib/api/fetch-api";
import { UsersPaginatedResponse } from "@/types/user";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    userType?: string;
  }>;
}

export default async function UsersPage({ params: routeParams, searchParams }: PageProps) {
  const { locale } = await routeParams;
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

  const usersData = await fetchApi<UsersPaginatedResponse>(`/users/paginated?${queryParams}`, {
    noStore: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage internal and external users"
        buttonText="Add User"
        buttonHref={`/${locale}/dashboard/users/add/internal`}
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
