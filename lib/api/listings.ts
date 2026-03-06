import { api } from "./axios";
import { ListingsApiResponse } from "@/types/listing";

export interface ListingsRequest {
  pageNumber: number;
  pageSize: number;
  search?: string;
  statusId?: number;
  cityId?: number;
  agentId?: number;
}

export const listingsApi = {
  getListings: async (
    params: ListingsRequest,
  ): Promise<ListingsApiResponse> => {
    const response = await api.post("/land/listings", params);
    return response.data;
  },
};
