import { Suspense } from "react";
import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import PageHeader from "@/components/features/dashboard/pageHeader/PageHeader";
import UsersContent from "@/components/features/users/UsersContent";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    userType?: string;
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Get access token from server session
  const token = await getServerAccessToken();
  
  // Redirect if not authenticated
  if (!token) {
    redirect("/login");
  }

  // Extract and parse search parameters
  const searchTerm = searchParams.search || undefined;
  const userType = searchParams.userType || 'internal';
  const pageNumber = parseInt(searchParams.page || '1');
  const pageSize = 20;

  // Construct API URL with query parameters
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
    userType: userType === 'internal' ? '1' : '2', // 1 = Internal, 2 = External
    ...(searchTerm && { searchTerm }),
  });

  // Fetch users data
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/paginated?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  // Handle response
  if (!response.ok) {
    if (response.status === 401) {
      redirect("/login");
    }
    // Log the error response for debugging
    const errorText = await response.text();
    console.error('Users API error:', response.status, errorText);
    throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("$$$$$$$$$$4",result);
  

  // Extract data from standard response structure
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
            search: searchParams.search || '',
            userType: userType as 'internal' | 'external',
          }}
        />
      </Suspense>
    </div>
  );
}
