import { fetchApi } from '@/lib/api/fetch-api';

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
  return fetchApi<AdminProfile>('/account/profile', { noStore: true });
}
