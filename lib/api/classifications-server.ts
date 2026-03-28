import { fetchApi } from './fetch-api';
import { CACHE_TAGS, CACHE_TTL } from './cache-config';
import type { Classification } from './classifications';

export async function fetchClassificationsServer(): Promise<Classification[]> {
  const data = await fetchApi<Classification[] | { value: Classification[] }>('/land-classifications', {
    revalidate: CACHE_TTL.REFERENCE,
    tags: [CACHE_TAGS.CLASSIFICATIONS, CACHE_TAGS.LOOKUP],
  });

  // Handle { value: [] } or []
  if (data && !Array.isArray(data) && Array.isArray((data as { value: Classification[] }).value)) {
    return (data as { value: Classification[] }).value;
  }
  if (Array.isArray(data)) return data;

  return [];
}
