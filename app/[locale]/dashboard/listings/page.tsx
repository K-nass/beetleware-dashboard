import { Suspense } from "react";
import PageHeader from "../../../../components/features/dashboard/pageHeader/PageHeader";
import ListingsContent from "@/components/features/listings/ListingsContent";
import { fetchLookupDataServer, getLookUpDataByKey } from "@/lib/api/lookup";
import { fetchApi } from "@/lib/api/fetch-api";
import { Listing, ListingsMeta } from "@/types/listing";
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

    const listingsData = await fetchApi<{ items: Listing[]; meta: ListingsMeta }>('/land/listings', {
        method: 'POST',
        body: requestBody,
        noStore: true,
    });
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