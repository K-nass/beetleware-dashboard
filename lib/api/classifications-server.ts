import { getServerAccessToken } from '@/lib/auth/get-server-token';
import type { Classification } from './classifications';

export async function fetchClassificationsServer(): Promise<Classification[]> {
  const token = await getServerAccessToken();

  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land-classifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch classifications: ${response.status}`);
  }

  const result = await response.json();

  if (!result.succeeded) {
    throw new Error(result.message || 'Failed to fetch classifications');
  }

  // Handle { data: { value: [] } } or { data: [] }
  const data = result.data;
  if (data?.value && Array.isArray(data.value)) return data.value;
  if (Array.isArray(data)) return data;

  return [];
}
