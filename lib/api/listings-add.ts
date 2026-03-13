import { api } from './axios';

export interface AddListingRequest {
  userId?: number | null;
  agentId?: number | null;
  title?: string | null;
  description?: string | null;
  area: number;
  price: number;
  cityId: number;
  regionId: number;
  address?: string | null;
  googleMapsLink?: string | null;
  landTypeId?: number | null;
  landFacingId?: number | null;
  ownershipStatusId?: number | null;
  deedTypeId?: number | null;
  neighborTypeId?: number | null;
  classificationId?: number | null;
  features?: string[] | null;
  imageUrls?: string[] | null;
  explanatoryVideoUrl?: string | null;
  titleDeedUrl?: string | null;
  nationalIdCopyUrl?: string | null;
  landSurveyReportUrl?: string | null;
  statusId?: number | null;
  buyerId?: number | null;
  purchasedPrice?: number | null;
}

export interface AddListingResponse {
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: number; // Returns the new listing ID
}

/**
 * Adds a new land listing to the system
 * @param data - The listing data to create
 * @returns The ID of the newly created listing
 * @throws Error if the API call fails or returns an error response
 */
export const addListing = async (data: AddListingRequest): Promise<number> => {
  try {
    const response = await api.post<AddListingResponse>('/land/add', data);
    
    if (response.data.succeeded) {
      return response.data.data; // Return the new listing ID
    } else {
      throw new Error(response.data.message || 'Failed to add listing');
    }
  } catch (error) {
    console.error('Error adding listing:', error);
    throw error;
  }
};

/**
 * Extracts a user-friendly error message from various error formats
 * @param error - The error object from the API call
 * @returns A formatted error message string
 */
export const extractErrorMessage = (error: any): string => {
  // Check for API response error message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for API response errors array
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.join(', ');
  }
  
  // Check for standard error message
  if (error?.message) {
    return error.message;
  }
  
  // Default fallback message
  return 'Failed to add listing. Please try again.';
};
