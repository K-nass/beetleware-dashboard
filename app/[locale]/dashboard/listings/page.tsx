import { Suspense } from "react";
import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import PageHeader from "../../../../components/features/dashboard/pageHeader/PageHeader";
import ListingsContent from "@/components/features/listings/ListingsContent";

interface PageProps {
    searchParams: {
        page?: string;
        search?: string;
        statusId?: string;
        cityId?: string;
        agentId?: string;
    };
}

export default async function ListingsPage({ searchParams }: PageProps) {
    // Get access token from server session
    const token = await getServerAccessToken();
    
    // Redirect if not authenticated
    if (!token) {
        redirect("/login");
    }

    // Extract and parse search parameters
    const pageNumber = parseInt(searchParams.page || '1');
    const search = searchParams.search || undefined;
    const statusId = searchParams.statusId ? parseInt(searchParams.statusId) : undefined;
    const cityId = searchParams.cityId ? parseInt(searchParams.cityId) : undefined;
    const agentId = searchParams.agentId ? parseInt(searchParams.agentId) : undefined;

    // Construct request body
    const requestBody = {
        pageNumber,
        pageSize: 15,
        ...(search && { search }),
        ...(statusId && { statusId }),
        ...(cityId && { cityId }),
        ...(agentId && { agentId }),
    };

    // Fetch listings data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land/listings`, {
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
        throw new Error(`Failed to fetch listings: ${response.status}`);
    }

    const result = await response.json();

    // Extract data from standard response structure
    if (!result.succeeded) {
        throw new Error(result.message || 'Failed to fetch listings');
    }

    const listingsData = result.data;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Listings Management" 
                description="Manage property listings and approvals"
                buttonText="Add Listing"
                buttonHref="/dashboard/listings/add"
            />
            
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500 text-lg">Loading listings...</div>
                </div>
            }>
                <ListingsContent 
                    initialListings={listingsData.items}
                    initialPagination={listingsData.meta}
                    initialFilters={{
                        search: searchParams.search || '',
                        statusId: searchParams.statusId || 'all',
                        cityId: searchParams.cityId || 'all',
                        agentId: searchParams.agentId || 'all',
                    }}
                />
            </Suspense>
        </div>
    );
}