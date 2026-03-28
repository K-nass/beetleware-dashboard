'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { revalidatePath } from 'next/cache';
import { buildHeaders } from './helpers';
import type { ActionResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------------------------------------
// Land Classifications
// ---------------------------------------------------------------------------

export async function createLandClassification(
  _prevState: ActionResponse<void> | null,
  formData: FormData
): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const code = formData.get('code') as string | null;
  if (!code?.trim()) return { success: false, error: 'code is required' };

  const nameEn = formData.get('nameEn') as string | null;
  if (!nameEn?.trim()) return { success: false, error: 'nameEn is required' };

  const nameAr = formData.get('nameAr') as string | null;
  if (!nameAr?.trim()) return { success: false, error: 'nameAr is required' };

  const discountPercentRaw = formData.get('discountPercent') as string | null;
  if (!discountPercentRaw?.trim()) return { success: false, error: 'discountPercent is required' };
  const discountPercent = parseFloat(discountPercentRaw);

  try {
    const res = await fetch(`${API_URL}/land-classifications`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ code, nameEn, nameAr, discountPercent }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateLandClassification(
  _prevState: ActionResponse<void> | null,
  formData: FormData
): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const idRaw = formData.get('id') as string | null;
  if (!idRaw?.trim()) return { success: false, error: 'id is required' };
  const id = parseInt(idRaw, 10);

  const nameEn = formData.get('nameEn') as string | null;
  if (!nameEn?.trim()) return { success: false, error: 'nameEn is required' };

  const nameAr = formData.get('nameAr') as string | null;
  if (!nameAr?.trim()) return { success: false, error: 'nameAr is required' };

  const discountPercentRaw = formData.get('discountPercent') as string | null;
  if (!discountPercentRaw?.trim()) return { success: false, error: 'discountPercent is required' };
  const discountPercent = parseFloat(discountPercentRaw);

  try {
    const res = await fetch(`${API_URL}/land-classifications/${id}`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ id, nameEn, nameAr, discountPercent }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteLandClassification(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const id = Number(formData.get('id'));

  try {
    const res = await fetch(`${API_URL}/land-classifications/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(session.accessToken),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export async function createFaq(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const questionEn = formData.get('questionEn') as string | null;
  if (!questionEn?.trim()) return { success: false, error: 'questionEn is required' };

  const questionAr = formData.get('questionAr') as string | null;
  if (!questionAr?.trim()) return { success: false, error: 'questionAr is required' };

  const answerEn = formData.get('answerEn') as string | null;
  if (!answerEn?.trim()) return { success: false, error: 'answerEn is required' };

  const answerAr = formData.get('answerAr') as string | null;
  if (!answerAr?.trim()) return { success: false, error: 'answerAr is required' };

  try {
    const res = await fetch(`${API_URL}/faq/add`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ questionEn, questionAr, answerEn, answerAr }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateFaq(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const idRaw = formData.get('id') as string | null;
  if (!idRaw?.trim()) return { success: false, error: 'id is required' };
  const id = parseInt(idRaw, 10);

  const questionEn = formData.get('questionEn') as string | null;
  if (!questionEn?.trim()) return { success: false, error: 'questionEn is required' };

  const questionAr = formData.get('questionAr') as string | null;
  if (!questionAr?.trim()) return { success: false, error: 'questionAr is required' };

  const answerEn = formData.get('answerEn') as string | null;
  if (!answerEn?.trim()) return { success: false, error: 'answerEn is required' };

  const answerAr = formData.get('answerAr') as string | null;
  if (!answerAr?.trim()) return { success: false, error: 'answerAr is required' };

  try {
    const res = await fetch(`${API_URL}/faq/update`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ id, questionEn, questionAr, answerEn, answerAr }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteFaq(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const id = Number(formData.get('id'));

  try {
    const res = await fetch(`${API_URL}/faq/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(session.accessToken),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function reorderFaqs(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const orderedIds: number[] = JSON.parse(formData.get('orderedIds') as string);
  const items = orderedIds.map((id, index) => ({ id, displayOrder: index + 1 }));

  try {
    const res = await fetch(`${API_URL}/faq/reorder`, {
      method: 'PATCH',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ items }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// Commission Settings
// ---------------------------------------------------------------------------

export async function updateCommissionSettings(
  _prevState: ActionResponse<void> | null,
  formData: FormData
): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const globalCommissionRateRaw = formData.get('globalCommissionRate') as string | null;
  if (!globalCommissionRateRaw?.trim()) return { success: false, error: 'globalCommissionRate is required' };
  const globalCommissionRate = parseFloat(globalCommissionRateRaw);

  const minOfferPercentRaw = formData.get('minOfferPercent') as string | null;
  if (!minOfferPercentRaw?.trim()) return { success: false, error: 'minOfferPercent is required' };
  const minOfferPercent = parseFloat(minOfferPercentRaw);

  const maxOfferPercentRaw = formData.get('maxOfferPercent') as string | null;
  if (!maxOfferPercentRaw?.trim()) return { success: false, error: 'maxOfferPercent is required' };
  const maxOfferPercent = parseFloat(maxOfferPercentRaw);

  try {
    const res = await fetch(`${API_URL}/commissionoffersettings`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ globalCommissionRate, minOfferPercent, maxOfferPercent }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateGlobalCommission(
  _prevState: ActionResponse<void> | null,
  formData: FormData
): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const globalCommissionRateRaw = formData.get('globalCommissionRate') as string | null;
  if (!globalCommissionRateRaw?.trim()) return { success: false, error: 'globalCommissionRate is required' };
  const globalCommissionRate = parseFloat(globalCommissionRateRaw);

  try {
    const res = await fetch(`${API_URL}/commissionoffersettings/global-commission`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ globalCommissionRate }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateMinOffer(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const minOfferPercentRaw = formData.get('minOfferPercent') as string | null;
  if (!minOfferPercentRaw?.trim()) return { success: false, error: 'minOfferPercent is required' };
  const minOfferPercent = parseFloat(minOfferPercentRaw);

  try {
    const res = await fetch(`${API_URL}/commissionoffersettings/min-offer`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ minOfferPercent }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateMaxOffer(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const maxOfferPercentRaw = formData.get('maxOfferPercent') as string | null;
  if (!maxOfferPercentRaw?.trim()) return { success: false, error: 'maxOfferPercent is required' };
  const maxOfferPercent = parseFloat(maxOfferPercentRaw);

  try {
    const res = await fetch(`${API_URL}/commissionoffersettings/max-offer`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ maxOfferPercent }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// Communications Settings
// ---------------------------------------------------------------------------

export async function updateCommunicationsSettings(
  _prevState: ActionResponse<void> | null,
  formData: FormData
): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const whatsAppNumber = formData.get('whatsAppNumber') as string | null;
  if (!whatsAppNumber?.trim()) return { success: false, error: 'whatsAppNumber is required' };

  const contactUsEmail = formData.get('contactUsEmail') as string | null;
  if (!contactUsEmail?.trim()) return { success: false, error: 'contactUsEmail is required' };

  const supportEmail = formData.get('supportEmail') as string | null;
  if (!supportEmail?.trim()) return { success: false, error: 'supportEmail is required' };

  const businessHours = formData.get('businessHours') as string | null;
  if (!businessHours?.trim()) return { success: false, error: 'businessHours is required' };

  const timeZone = formData.get('timeZone') as string | null;
  if (!timeZone?.trim()) return { success: false, error: 'timeZone is required' };

  try {
    const res = await fetch(`${API_URL}/communicationssettings`, {
      method: 'PUT',
      headers: buildHeaders(session.accessToken),
      body: JSON.stringify({ whatsAppNumber, contactUsEmail, supportEmail, businessHours, timeZone }),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}
