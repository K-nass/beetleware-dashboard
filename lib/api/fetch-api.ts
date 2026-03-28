import { getServerAccessToken } from '@/lib/auth/get-server-token';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  tags?: string[];
  revalidate?: number;
  noStore?: boolean;
}

export async function fetchApi<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, tags, revalidate, noStore } = options;

  const token = await getServerAccessToken();

  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate, tags };
  } else if (noStore) {
    fetchOptions.cache = 'no-store';
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, fetchOptions);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.succeeded === false) {
    throw new Error(result.message || 'API request failed');
  }

  return result.data as T;
}
