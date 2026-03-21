'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { buildHeaders } from './helpers';
import type { LookupItem } from '@/lib/api/lookup';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchRegionsAction(cityId: number): Promise<LookupItem[]> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/lookup/regions?cityId=${cityId}`, {
    headers: buildHeaders(session.accessToken),
  });

  if (!res.ok) throw new Error('Failed to fetch regions');

  const json = await res.json();
  if (!json.succeeded) throw new Error(json.message || 'Failed to fetch regions');

  // API may wrap array in a { value: [] } envelope
  const data = json.data;
  if (data && Array.isArray(data.value)) return data.value;
  if (Array.isArray(data)) return data;
  return [];
}
