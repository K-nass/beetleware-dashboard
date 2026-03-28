import { fetchApi } from '@/lib/api/fetch-api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/api/cache-config';

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
  landClassifications: LookupItem[] | null;
}

export const findLookupItem = (items: LookupItem[], value: number): LookupItem | undefined =>
  items.find(item => item.value === value);

export const getLookupLabel = (items: LookupItem[], value: number): string =>
  findLookupItem(items, value)?.label || `Unknown (${value})`;

export const getLookUpDataByKey = (lookupData: LookupData | null, field: keyof LookupData): LookupItem[] => {
  if (!lookupData || !lookupData[field]) return [];
  return lookupData[field] as LookupItem[];
};

export async function fetchLookupDataServer(): Promise<LookupData> {
  return fetchApi<LookupData>('/lookup/all', {
    revalidate: CACHE_TTL.REFERENCE,
    tags: [CACHE_TAGS.LOOKUP],
  });
}

export async function fetchRegionsServer(cityId: number): Promise<LookupItem[]> {
  const data = await fetchApi<{ value: LookupItem[] } | LookupItem[]>(`/lookup/regions?cityId=${cityId}`, {
    revalidate: CACHE_TTL.REFERENCE,
    tags: [CACHE_TAGS.LOOKUP],
  });

  if (data && !Array.isArray(data) && Array.isArray((data as { value: LookupItem[] }).value)) {
    return (data as { value: LookupItem[] }).value;
  }
  if (Array.isArray(data)) return data;
  return [];
}

export async function fetchLandClassificationsServer(): Promise<LookupItem[]> {
  const data = await fetchApi<{ value: Array<{ id: number; nameEn?: string; name?: string; code: string }> }>('/land-classifications', {
    revalidate: CACHE_TTL.REFERENCE,
    tags: [CACHE_TAGS.CLASSIFICATIONS, CACHE_TAGS.LOOKUP],
  });

  const items = data?.value || [];
  return items.map((item) => ({
    value: item.id,
    label: item.nameEn || item.name || `Class ${item.code}`,
  }));
}

