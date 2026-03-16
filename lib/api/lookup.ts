import { api } from './axios';

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

export const fetchAllLookupData = async (): Promise<LookupData> => {
  try {
    const response = await api.get<AllLookupsApiResponse>('/lookup/all');
    
    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch lookup data');
    }
  } catch (error) {
    throw error;
  }
};

export const fetchCities = async (): Promise<LookupItem[]> => {
  try {
    const response = await api.get('/lookup/cities');
    
    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch cities');
    }
  } catch (error) {
    throw error;
  }
};

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
    throw error;
  }
};

export const findLookupItem = (items: LookupItem[], value: number): LookupItem | undefined => {
  return items.find(item => item.value === value);
};

export const getLookupLabel = (items: LookupItem[], value: number): string => {
  const item = findLookupItem(items, value);
  return item?.label || `Unknown (${value})`;
};

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