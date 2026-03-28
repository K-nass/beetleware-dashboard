'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildHeaders } from './helpers';
import type { ActionResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------------------------------------
// addRole
// ---------------------------------------------------------------------------
export async function addRole(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const roleName = formData.get('roleName') as string | null;
  if (!roleName?.trim()) {
    return { success: false, error: 'roleName is required' };
  }

  const description = formData.get('description') as string | null;
  if (!description?.trim()) {
    return { success: false, error: 'description is required' };
  }

  const isActive = formData.get('isActive') === 'true';

  const claimIds: number[] = formData.getAll('claimIds').map(Number);

  try {
    const res = await fetch(`${API_URL}/roles/add`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ roleName, description, isActive, claimIds }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/roles');
  } catch (error) {
    if ((error as any)?.digest?.includes('NEXT_REDIRECT')) throw error;
    return { success: false, error: 'An unexpected error occurred' };
  }

  redirect('/dashboard/roles');
}

// ---------------------------------------------------------------------------
// updateRole
// ---------------------------------------------------------------------------
export async function updateRole(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const roleIdRaw = formData.get('roleId') as string | null;
  if (!roleIdRaw?.trim()) {
    return { success: false, error: 'roleId is required' };
  }
  const roleId = parseInt(roleIdRaw, 10);

  const roleName = formData.get('roleName') as string | null;
  if (!roleName?.trim()) {
    return { success: false, error: 'roleName is required' };
  }

  const description = formData.get('description') as string | null;
  if (!description?.trim()) {
    return { success: false, error: 'description is required' };
  }

  const isActive = formData.get('isActive') === 'true';

  const claimIds: number[] = formData.getAll('claimIds').map(Number);

  try {
    const res = await fetch(`${API_URL}/roles/${roleId}`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ roleId, roleName, description, isActive, claimIds }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/roles');
  } catch (error) {
    if ((error as any)?.digest?.includes('NEXT_REDIRECT')) throw error;
    return { success: false, error: 'An unexpected error occurred' };
  }

  redirect('/dashboard/roles');
}

// ---------------------------------------------------------------------------
// deleteRole
// ---------------------------------------------------------------------------
export async function deleteRole(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const roleId = Number(formData.get('roleId'));

  try {
    const res = await fetch(`${API_URL}/roles/${roleId}`, {
      method: 'DELETE',
      headers: buildHeaders(session.accessToken),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/roles');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}
