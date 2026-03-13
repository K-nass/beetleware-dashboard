import { api } from "./axios";
import {
  Faq,
  AddFaqCommand,
  UpdateFaqCommand,
  ReorderFaqsCommand,
  ApiResponse
} from "@/types/settings";

export const faqApi = {
  // Get all FAQs
  getAll: async (): Promise<ApiResponse<Faq[]>> => {
    try {
      const response = await api.get("/faq/list");
      
      // Handle the API response structure
      if (response.data && response.data.succeeded && response.data.data) {
        // Check if data has an items property with an array
        if (response.data.data.items && Array.isArray(response.data.data.items)) {
          return {
            ...response.data,
            data: response.data.data.items
          };
        }
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
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to fetch FAQs',
        errors: error?.response?.data?.errors || null,
        data: [] as Faq[]
      };
    }
  },

  // Create new FAQ
  create: async (data: AddFaqCommand): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post("/faq/add", data);
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to create FAQ',
        errors: error?.response?.data?.errors || null,
        data: undefined as any
      };
    }
  },

  // Update existing FAQ
  update: async (data: UpdateFaqCommand): Promise<ApiResponse<void>> => {
    try {
      const response = await api.put("/faq/update", data);
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to update FAQ',
        errors: error?.response?.data?.errors || null,
        data: undefined as any
      };
    }
  },

  // Reorder FAQs
  reorder: async (data: ReorderFaqsCommand): Promise<ApiResponse<void>> => {
    try {
      const response = await api.patch("/faq/reorder", data);
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to reorder FAQs',
        errors: error?.response?.data?.errors || null,
        data: undefined as any
      };
    }
  },

  // Delete FAQ
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/faq/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to delete FAQ',
        errors: error?.response?.data?.errors || null,
        data: undefined as any
      };
    }
  }
};
