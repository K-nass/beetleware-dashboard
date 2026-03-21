import { Suspense } from "react";
import { getServerAccessToken } from "@/lib/auth/get-server-token";
import PageHeader from "../../../../components/features/dashboard/pageHeader/PageHeader";
import ListingsContent from "@/components/features/listings/ListingsContent";
import { fetchLookupDataServer, getLookUpDataByKey } from "@/lib/api/lookup";
import { Loader } from "lucide-react";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        statusId?: string;
        cityId?: string;
        agentId?: string;
    }>;
}

export default async function ListingsPage({ searchParams }: PageProps) {
    const token = await getServerAccessToken();

    const { search, statusId, cityId, agentId, page } = await searchParams;

    const pageNumber = parseInt(page || '1');

    const requestBody = {
        pageNumber,
        pageSize: 15,
        ...(search && { search }),
        ...(statusId && { statusId }),
        ...(cityId && { cityId }),
        ...(agentId && { agentId }),
    };


    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land/listings`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
    }

    const result = await response.json();
    if (!result.succeeded) {
        throw new Error(result.message || 'Failed to fetch listings');
    }

    const listingsData = result.data;
    console.log("meta",listingsData.meta);
    
    const lookupData = await fetchLookupDataServer();

    const statuses = getLookUpDataByKey(lookupData, 'landOfferStatus');

    const cities = getLookUpDataByKey(lookupData, 'cities');

    return (
        <div className="space-y-6">
            <PageHeader
                title="Listings Management"
                description="Manage property listings and approvals"
                buttonText="Add Listing"
                buttonHref="/dashboard/listings/add"
            />

            <Suspense fallback={
                <Loader />
            }>
                <ListingsContent
                    initialListings={listingsData.items}
                    initialPagination={listingsData.meta}
                    initialFilters={{
                        search: search || '',
                        statusId: statusId?.toString() || 'all',
                        cityId: cityId?.toString() || 'all',
                        agentId: agentId?.toString() || 'all',
                    }}
                    statuses={statuses}
                    cities={cities}
                />
            </Suspense>
        </div>
    );
}