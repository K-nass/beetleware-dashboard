import { api } from "./axios";
import {
  Faq,
  AddFaqCommand,
  UpdateFaqCommand,
  ReorderFaqsCommand,
  ApiResponse
} from "@/types/settings";

export const faqApi = {
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
