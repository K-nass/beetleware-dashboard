"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "./ListingCard";
import ListingsFilter from "./ListingsFilter";
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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateSearchParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (searchTerm: string) => {
        updateSearchParams({ search: searchTerm, page: null });
    };

    const handleStatusFilter = (statusId: string) => {
        updateSearchParams({ statusId: statusId === 'all' ? null : statusId, page: null });
    };

    const handleCityFilter = (cityId: string) => {
        updateSearchParams({ cityId: cityId === 'all' ? null : cityId, page: null });
    };

    const handleAgentFilter = (agentId: string) => {
        updateSearchParams({ agentId: agentId === 'all' ? null : agentId, page: null });
    };

    const handlePageChange = (page: number) => {
        updateSearchParams({ page: page.toString() });
    };

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
                onSearch={handleSearch}
                onStatusFilter={handleStatusFilter}
                onCityFilter={handleCityFilter}
                onAgentFilter={handleAgentFilter}
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

            {/* Pagination */}
            {initialPagination.totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex items-center text-sm text-gray-700">
                        <span>
                            Showing {((initialPagination.pageNumber - 1) * initialPagination.pageSize) + 1} to{' '}
                            {Math.min(initialPagination.pageNumber * initialPagination.pageSize, initialPagination.totalCount)} of{' '}
                            {initialPagination.totalCount} results
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(initialPagination.pageNumber - 1)}
                            disabled={initialPagination.pageNumber <= 1}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, initialPagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (initialPagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (initialPagination.pageNumber <= 3) {
                                    pageNum = i + 1;
                                } else if (initialPagination.pageNumber >= initialPagination.totalPages - 2) {
                                    pageNum = initialPagination.totalPages - 4 + i;
                                } else {
                                    pageNum = initialPagination.pageNumber - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                            pageNum === initialPagination.pageNumber
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={() => handlePageChange(initialPagination.pageNumber + 1)}
                            disabled={initialPagination.pageNumber >= initialPagination.totalPages}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}