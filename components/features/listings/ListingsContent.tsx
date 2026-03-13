"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { listingsApi, ListingsRequest } from "@/lib/api/listings";
import { ListingsApiResponse } from "@/types/listing";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "./ListingCard";
import ListingsFilter from "./ListingsFilter";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface SearchParams {
  search?: string;
  statusId?: string;
  cityId?: string;
  agentId?: string;
  page?: string;
}

const getStatusId = (status: string): number | undefined => {
  switch (status) {
    case "pending": return 1;
    case "active": return 2;
    case "rejected": return 3;
    case "hold": return 5;
    default: return undefined;
  }
};

const getStatusLabel = (statusLabel: string): "pending" | "approved" | "rejected" => {
  switch (statusLabel.toLowerCase()) {
    case "pending": return "pending";
    case "active": return "approved";
    case "rejected": return "rejected";
    default: return "pending";
  }
};

export default function ListingsContent() {
  const { isAuthenticated, token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [listings, setListings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 15,
    totalCount: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchListings = async () => {
    if (!isAuthenticated || !token) {
      setError("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params: ListingsRequest = {
        pageNumber: parseInt(searchParams.get('page') || '1'),
        pageSize: 15,
        search: searchParams.get('search') || undefined,
        statusId: searchParams.get('statusId') ? parseInt(searchParams.get('statusId')!) : undefined,
        cityId: searchParams.get('cityId') ? parseInt(searchParams.get('cityId')!) : undefined,
        agentId: searchParams.get('agentId') ? parseInt(searchParams.get('agentId')!) : undefined,
      };

      const response = await listingsApi.getListings(params);
      
      if (response.succeeded) {
        setListings(response.data.items);
        setPagination(response.data.meta);
      } else {
        setError(response.message || "Failed to fetch listings");
        setListings([]);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("An error occurred while fetching listings");
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [isAuthenticated, token, searchParams]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">Please log in to view listings</div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (listings.length === 0) {
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
        initialSearch={searchParams.get('search') || ''}
        initialStatusId={searchParams.get('statusId') || 'all'}
        initialCityId={searchParams.get('cityId') || 'all'}
        initialAgentId={searchParams.get('agentId') || 'all'}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {listings.map((listing) => (
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
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing {((pagination.pageNumber - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} of{' '}
              {pagination.totalCount} results
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.pageNumber <= 3) {
                  pageNum = i + 1;
                } else if (pagination.pageNumber >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.pageNumber - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNum === pagination.pageNumber
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
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPages}
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