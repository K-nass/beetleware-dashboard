import { api } from "./axios";

// TypeScript interfaces for classification data structures
export interface Classification {
  id: number;
  code: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  discountPercent?: number;
}

export interface SetLandClassificationRequest {
  landId: number;
  classificationId: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: T | null;
}

/**
 * Fetches all available land classifications
 * GET /api/admin/land-classifications
 */
export const getClassifications = async (): Promise<Classification[]> => {
  try {
    const response = await api.get("/land-classifications");
    
    // Handle the API response structure: { succeeded, data: { value: [] } }
    if (response.data && response.data.succeeded && response.data.data) {
      // Check if data has a value property with an array
      if (response.data.data.value && Array.isArray(response.data.data.value)) {
        return response.data.data.value;
      }
      // Fallback: if data itself is an array
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }
    
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Error fetching classifications:", error);
    throw error;
  }
};

/**
 * Updates the classification of a land listing
 * POST /api/admin/land/update-classification
 */
export const updateLandClassification = async (
  request: SetLandClassificationRequest
): Promise<string> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      "/land/update-classification",
      request
    );
    
    if (!response.data.succeeded) {
      throw new Error(response.data.message || "Failed to update classification");
    }
    
    // Return the success message from the backend
    return response.data.message || "Classification updated successfully";
  } catch (error) {
    console.error("Error updating classification:", error);
    throw error;
  }
};
