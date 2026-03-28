export interface Listing {
  id: number;
  title: string;
  address: string;
  city: string;
  region: string;
  area: number;
  landType: string;
  price: number;
  totalPrice: number | null;
  discountedPrice: number | null;
  statusId: number;
  statusLabel: string;
  agentName: string | null;
  offersCount: number;
  isFavorite: boolean;
  thumbnailUrl: string;
  pendingRequestsCount: number;
  classificationId: number | null;
  classificationName: string | null;
  discountPercent: number | null;
}

export interface ListingsMeta {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListingsApiResponse {
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: {
    items: Listing[];
    meta: ListingsMeta;
  };
}
