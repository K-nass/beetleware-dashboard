import { getServerAccessToken } from '@/lib/auth/get-server-token';
import { LookupData, LookupItem } from './lookup';

export async function fetchLookupDataServer(): Promise<LookupData> {
  const token = await getServerAccessToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lookup/all`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next :{revalidate:3600}
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lookup data: ${response.status}`);
  }

  const result = await response.json();
  
  if (!result.succeeded) {
    throw new Error(result.message || 'Failed to fetch lookup data');
  }

  return result.data;
}

export async function fetchRegionsServer(cityId: number): Promise<LookupItem[]> {
  const token = await getServerAccessToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/lookup/regions?cityId=${cityId}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next:{revalidate:3600}
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch regions: ${response.status}`);
  }

  const result = await response.json();
  
  if (!result.succeeded) {
    throw new Error(result.message || 'Failed to fetch regions');
  }

  return result.data;
}
