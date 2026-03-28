import { getServerAccessToken } from '@/lib/auth/get-server-token';

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  permissions: string[];
  isActive: boolean;
}

export async function fetchProfileServer(): Promise<AdminProfile> {
  const token = await getServerAccessToken();

  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  const result = await response.json();

  if (!result.succeeded) {
    throw new Error(result.message || 'Failed to fetch profile');
  }

  return result.data;
}
