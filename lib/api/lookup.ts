import { api } from './axios';

// TypeScript interfaces for lookup data structures
export interface LookupItem {
  value: number;
  label: string;
}

export interface LookupData {
  cities: LookupItem[] | null;
  regions: LookupItem[] | null;
  landTypes: LookupItem[] | null;
  landFacing: LookupItem[] | null;
  ownershipStatus: LookupItem[] | null;
  deedTypes: LookupItem[] | null;
  neighborTypes: LookupItem[] | null;
  landStatus: LookupItem[] | null;
  genders: LookupItem[] | null;
  landOfferStatus: LookupItem[] | null;
}

export interface AllLookupsApiResponse {
  statusCode: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: LookupData;
}

/**
 * Fetches all lookup data from the /api/admin/lookup/all endpoint
 * Returns normalized lookup data with consistent value/label structure
 */
export const fetchAllLookupData = async (): Promise<LookupData> => {
  try {
    const response = await api.get<AllLookupsApiResponse>('/lookup/all');
    console.log(response.data.data);
    
    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch lookup data');
    }
  } catch (error) {
    console.error('Error fetching lookup data:', error);
    throw error;
  }
};

/**
 * Fetches cities lookup data
 * Fallback function if all lookups fail
 */
export const fetchCities = async (): Promise<LookupItem[]> => {
  try {
    const response = await api.get('/lookup/cities');
    
    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch cities');
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

/**
 * Fetches regions lookup data for a specific city
 * Used for city-region dependency
 */
export const fetchRegions = async (cityId?: number): Promise<LookupItem[]> => {
  try {
    const url = cityId 
      ? `/lookup/regions?cityId=${cityId}`
      : '/lookup/regions';
    
    const response = await api.get(url);
    
    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch regions');
    }
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

/**
 * Helper function to find a lookup item by value
 */
export const findLookupItem = (items: LookupItem[], value: number): LookupItem | undefined => {
  return items.find(item => item.value === value);
};

/**
 * Helper function to get label by value
 */
export const getLookupLabel = (items: LookupItem[], value: number): string => {
  const item = findLookupItem(items, value);
  return item?.label || `Unknown (${value})`;
};

/**
 * Helper function to safely get an array from lookup data
 * Returns empty array if the field is null or undefined
 */
export const safeGetLookupArray = (lookupData: LookupData | null, field: keyof LookupData): LookupItem[] => {
  if (!lookupData || !lookupData[field]) {
    return [];
  }
  return lookupData[field] as LookupItem[];
};
export const validateLookupData = (data: Partial<LookupData>): string[] => {
  const errors: string[] = [];
  const requiredFields: (keyof LookupData)[] = [
    'cities',
    'regions', 
    'landTypes',
    'landFacing',
    'ownershipStatus',
    'deedTypes',
    'neighborTypes',
    'landStatus'
  ];

  requiredFields.forEach(field => {
    if (!data[field] || !Array.isArray(data[field]) || data[field]!.length === 0) {
      errors.push(`Missing or empty ${field} data`);
    }
  });

  return errors;
};