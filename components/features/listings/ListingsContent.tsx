import ListingCard from "./ListingCard";
import ListingsFilter from "./ListingsFilter";
import PaginationControls from "./PaginationControls";
import { LookupItem } from "@/lib/api/lookup";

interface ListingsContentProps {
    initialListings: any[];
    initialPagination: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
    initialFilters: {
        search: string;
        statusId: string;
        cityId: string;
        agentId: string;
    };
    statuses: LookupItem[];
    cities: LookupItem[];
}

const getStatusLabel = (statusLabel: string): "pending" | "approved" | "rejected" => {
    switch (statusLabel.toLowerCase()) {
        case "pending": return "pending";
        case "active": return "approved";
        case "rejected": return "rejected";
        default: return "pending";
    }
};

export default function ListingsContent({ 
    initialListings, 
    initialPagination, 
    initialFilters,
    statuses,
    cities,
}: ListingsContentProps) {
    if (initialListings.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">No listings found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ListingsFilter
                statuses={statuses}
                cities={cities}
                initialSearch={initialFilters.search}
                initialStatusId={initialFilters.statusId}
                initialCityId={initialFilters.cityId}
                initialAgentId={initialFilters.agentId}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {initialListings.map((listing, index) => (
                    <ListingCard 
                        key={listing.id}
                        id={listing.id.toString()}
                        title={listing.title}
                        location={listing.city}
                        district={listing.region}
                        area={listing.area}
                        type={listing.landType}
                        originalPrice={listing.price}
                        currentPrice={listing.discountedPrice || listing.price}
                        discount={listing.discountPercent || 0}
                        agent={listing.agentName || "N/A"}
                        status={getStatusLabel(listing.statusLabel)}
                        classification={listing.classificationName || "N/A"}
                        image={listing.thumbnailUrl || "/listing.svg"}
                        priority={index < 3}
                    />
                ))}
            </div>

            <PaginationControls {...initialPagination} />
        </div>
    );
}
