import { api } from "./axios";
import {
  LandClassification,
  CreateLandClassificationCommand,
  UpdateLandClassificationCommand,
  ApiResponse
} from "@/types/settings";

export const landClassificationsApi = {
  // Get all land classifications
  getAll: async (): Promise<ApiResponse<LandClassification[]>> => {
    try {
      const response = await api.get("/land-classifications");
      
      // Handle the API response structure: { succeeded, data: { value: [] } }
      if (response.data && response.data.succeeded && response.data.data) {
        // Check if data has a value property with an array
        if (response.data.data.value && Array.isArray(response.data.data.value)) {
          return {
            ...response.data,
            data: response.data.data.value
          };
        }
        // Fallback: if data itself is an array
        if (Array.isArray(response.data.data)) {
          return response.data;
        }
      }
      
      return response.data;
    } catch (error: any) {
      // Return error response in the same format
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to fetch land classifications',
        errors: error?.response?.data?.errors || null,
        data: [] as LandClassification[]
      };
    }
  },

  // Create new land classification
  create: async (
    data: CreateLandClassificationCommand
  ): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post("/land-classifications", data);
      return response.data;
    } catch (error: any) {
      // Return error response in the same format
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to create land classification',
        errors: error?.response?.data?.errors || null,
        data: undefined as any
      };
    }
  },

  // Update existing land classification
  update: async (
    id: number,
    data: UpdateLandClassificationCommand
  ): Promise<ApiResponse<void>> => {
    try {
      const response = await api.put(`/land-classifications/${id}`, {
        ...data,
        id
      });
      return response.data;
    } catch (error: any) {
      // Return error response in the same format
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to update land classification',
        errors: error?.response?.data?.errors || null,
        data: undefined as any
      };
    }
  },

  // Delete land classification
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/land-classifications/${id}`);
      return response.data;
    } catch (error: any) {
      // Return error response in the same format
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to delete land classification',
        errors: error?.response?.data?.errors || null,
        data: undefined as any
      };
    }
  }
};
