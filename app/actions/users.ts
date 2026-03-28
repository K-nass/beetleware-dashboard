'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildHeaders } from './helpers';
import type { ActionResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------------------------------------
// addInternalUser
// ---------------------------------------------------------------------------
export async function addInternalUser(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const email = formData.get('email') as string | null;
  if (!email?.trim()) return { success: false, error: 'email is required' };

  const password = formData.get('password') as string | null;
  if (!password?.trim()) return { success: false, error: 'password is required' };

  const fullName = formData.get('fullName') as string | null;
  if (!fullName?.trim()) return { success: false, error: 'fullName is required' };

  const phoneNumber = formData.get('phoneNumber') as string | null;
  if (!phoneNumber?.trim()) return { success: false, error: 'phoneNumber is required' };

  const role = formData.get('role') as string | null;
  if (!role?.trim()) return { success: false, error: 'role is required' };

  try {
    const res = await fetch(`${API_URL}/users/add-admin`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ email, password, fullName, phoneNumber, role }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/users');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// addExternalUser
// ---------------------------------------------------------------------------
export async function addExternalUser(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const email = formData.get('email') as string | null;
  if (!email?.trim()) return { success: false, error: 'email is required' };

  const password = formData.get('password') as string | null;
  if (!password?.trim()) return { success: false, error: 'password is required' };

  const fullName = formData.get('fullName') as string | null;
  if (!fullName?.trim()) return { success: false, error: 'fullName is required' };

  const phoneNumber = formData.get('phoneNumber') as string | null;
  if (!phoneNumber?.trim()) return { success: false, error: 'phoneNumber is required' };

  const genderIdRaw = formData.get('genderId') as string | null;
  if (!genderIdRaw?.trim()) return { success: false, error: 'genderId is required' };
  const genderId = parseInt(genderIdRaw, 10);

  const nationalId = formData.get('nationalId') as string | null;
  if (!nationalId?.trim()) return { success: false, error: 'nationalId is required' };

  const dateOfBirth = formData.get('dateOfBirth') as string | null;
  if (!dateOfBirth?.trim()) return { success: false, error: 'dateOfBirth is required' };

  try {
    const res = await fetch(`${API_URL}/users/add-external`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ email, password, fullName, phoneNumber, genderId, nationalId, dateOfBirth }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/users');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// updateInternalUser
// ---------------------------------------------------------------------------
export async function updateInternalUser(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const idRaw = formData.get('id') as string | null;
  if (!idRaw?.trim()) return { success: false, error: 'id is required' };
  const id = parseInt(idRaw, 10);

  const email = formData.get('email') as string | null;
  if (!email?.trim()) return { success: false, error: 'email is required' };

  const fullName = formData.get('fullName') as string | null;
  if (!fullName?.trim()) return { success: false, error: 'fullName is required' };

  const phoneNumber = formData.get('phoneNumber') as string | null;
  if (!phoneNumber?.trim()) return { success: false, error: 'phoneNumber is required' };

  const role = formData.get('role') as string | null;
  if (!role?.trim()) return { success: false, error: 'role is required' };

  const password = (formData.get('password') as string | null) ?? undefined;

  try {
    const res = await fetch(`${API_URL}/users/update`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ id, email, fullName, phoneNumber, role, ...(password ? { password } : {}) }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/users');
  } catch (error) {
    if ((error as any)?.digest?.includes('NEXT_REDIRECT')) throw error;
    return { success: false, error: 'An unexpected error occurred' };
  }

  redirect('/dashboard/users');
}

// ---------------------------------------------------------------------------
export async function updateExternalUser(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const idRaw = formData.get('id') as string | null;
  if (!idRaw?.trim()) return { success: false, error: 'id is required' };
  const id = parseInt(idRaw, 10);

  const email = formData.get('email') as string | null;
  if (!email?.trim()) return { success: false, error: 'email is required' };

  const fullName = formData.get('fullName') as string | null;
  if (!fullName?.trim()) return { success: false, error: 'fullName is required' };

  const phoneNumber = formData.get('phoneNumber') as string | null;
  if (!phoneNumber?.trim()) return { success: false, error: 'phoneNumber is required' };

  const genderIdRaw = formData.get('genderId') as string | null;
  if (!genderIdRaw?.trim()) return { success: false, error: 'genderId is required' };
  const genderId = parseInt(genderIdRaw, 10);

  const nationalId = formData.get('nationalId') as string | null;
  if (!nationalId?.trim()) return { success: false, error: 'nationalId is required' };

  const dateOfBirth = formData.get('dateOfBirth') as string | null;
  if (!dateOfBirth?.trim()) return { success: false, error: 'dateOfBirth is required' };

  const password = (formData.get('password') as string | null) ?? undefined;

  try {
    const res = await fetch(`${API_URL}/users/update-external`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ id, email, fullName, phoneNumber, genderId, nationalId, dateOfBirth, ...(password ? { password } : {}) }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/users');
  } catch (error) {
    if ((error as any)?.digest?.includes('NEXT_REDIRECT')) throw error;
    return { success: false, error: 'An unexpected error occurred' };
  }

  redirect('/dashboard/users');
}

// ---------------------------------------------------------------------------
// toggleUserStatus
// ---------------------------------------------------------------------------
export async function toggleUserStatus(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = Number(formData.get('userId'));

  try {
    const res = await fetch(`${API_URL}/users/${userId}/toggle-status`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/users');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// deleteUser
// ---------------------------------------------------------------------------
export async function deleteUser(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = Number(formData.get('userId'));

  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: buildHeaders(session.accessToken),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/users');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// getUserById
// ---------------------------------------------------------------------------
export async function getUserById(userId: number): Promise<ActionResponse<import('@/types/user').UserDetails>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: buildHeaders(session.accessToken),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Failed to load user details' };
    }

    return { success: true, data: json.data };
  } catch {
    return { success: false, error: 'An error occurred while loading user details' };
  }
}
