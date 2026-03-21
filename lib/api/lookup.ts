import { getServerAccessToken } from '@/lib/auth/get-server-token';

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

export const findLookupItem = (items: LookupItem[], value: number): LookupItem | undefined =>
  items.find(item => item.value === value);

export const getLookupLabel = (items: LookupItem[], value: number): string =>
  findLookupItem(items, value)?.label || `Unknown (${value})`;

export const safeGetLookupArray = (lookupData: LookupData | null, field: keyof LookupData): LookupItem[] => {
  if (!lookupData || !lookupData[field]) return [];
  return lookupData[field] as LookupItem[];
};

export async function fetchLookupDataServer(): Promise<LookupData> {
  const token = await getServerAccessToken();
  if (!token) throw new Error('No authentication token available');

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lookup/all`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error(`Failed to fetch lookup data: ${response.status}`);

  const result = await response.json();
  if (!result.succeeded) throw new Error(result.message || 'Failed to fetch lookup data');

  return result.data;
}

export async function fetchRegionsServer(cityId: number): Promise<LookupItem[]> {
  const token = await getServerAccessToken();
  if (!token) throw new Error('No authentication token available');

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lookup/regions?cityId=${cityId}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error(`Failed to fetch regions: ${response.status}`);

  const result = await response.json();
  if (!result.succeeded) throw new Error(result.message || 'Failed to fetch regions');

  const data = result.data;
  if (data && Array.isArray(data.value)) return data.value;
  if (Array.isArray(data)) return data;
  return [];
}
