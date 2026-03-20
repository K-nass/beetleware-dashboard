'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildHeaders } from './helpers';
import type { ActionResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------------------------------------
// addListing
// ---------------------------------------------------------------------------
export async function addListing(formData: FormData): Promise<never> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect('/dashboard/listings/add?error=Unauthorized');
  }

  const title = formData.get('title') as string | null;
  if (!title?.trim()) {
    redirect('/dashboard/listings/add?error=Title+is+required');
  }

  const area = formData.get('area') as string | null;
  if (!area?.trim()) {
    redirect('/dashboard/listings/add?error=Area+is+required');
  }

  const price = formData.get('price') as string | null;
  if (!price?.trim()) {
    redirect('/dashboard/listings/add?error=Price+is+required');
  }

  const cityId = formData.get('cityId') as string | null;
  if (!cityId?.trim()) {
    redirect('/dashboard/listings/add?error=City+is+required');
  }

  const regionId = formData.get('regionId') as string | null;
  if (!regionId?.trim()) {
    redirect('/dashboard/listings/add?error=Region+is+required');
  }

  // Optional array fields — accept either JSON array or comma-separated string
  const featuresRaw = formData.get('features') as string | null;
  const imageUrlsRaw = formData.get('imageUrls') as string | null;

  const parseArrayField = (raw: string | null) => {
    if (!raw?.trim()) return null;
    try { return JSON.parse(raw); } catch {
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
  };

  const body = {
    title,
    description: formData.get('description') as string | null,
    area: parseFloat(area),
    price: parseFloat(price),
    cityId: parseInt(cityId, 10),
    regionId: parseInt(regionId, 10),
    address: formData.get('address') as string | null,
    googleMapsLink: formData.get('googleMapsLink') as string | null,
    landTypeId: parseOptionalInt(formData.get('landTypeId') as string | null),
    landFacingId: parseOptionalInt(formData.get('landFacingId') as string | null),
    ownershipStatusId: parseOptionalInt(formData.get('ownershipStatusId') as string | null),
    deedTypeId: parseOptionalInt(formData.get('deedTypeId') as string | null),
    neighborTypeId: parseOptionalInt(formData.get('neighborTypeId') as string | null),
    classificationId: parseOptionalInt(formData.get('classificationId') as string | null),
    features: parseArrayField(featuresRaw),
    imageUrls: parseArrayField(imageUrlsRaw),
    explanatoryVideoUrl: formData.get('explanatoryVideoUrl') as string | null,
    titleDeedUrl: formData.get('titleDeedUrl') as string | null,
    nationalIdCopyUrl: formData.get('nationalIdCopyUrl') as string | null,
    landSurveyReportUrl: formData.get('landSurveyReportUrl') as string | null,
    statusId: parseOptionalInt(formData.get('statusId') as string | null),
    userId: parseOptionalInt(formData.get('userId') as string | null),
    agentId: parseOptionalInt(formData.get('agentId') as string | null),
    buyerId: parseOptionalInt(formData.get('buyerId') as string | null),
    purchasedPrice: parseOptionalFloat(formData.get('purchasedPrice') as string | null),
  };

  try {
    const res = await fetch(`${API_URL}/land/add`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken as string),
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!json.succeeded) {
      const msg = encodeURIComponent(json.message ?? json.errors?.[0] ?? 'Operation failed');
      redirect(`/dashboard/listings/add?error=${msg}`);
    }

    revalidatePath('/dashboard/listings');
    redirect('/dashboard/listings');
  } catch {
    redirect('/dashboard/listings/add?error=An+unexpected+error+occurred');
  }
}

// ---------------------------------------------------------------------------
// updateListing
// ---------------------------------------------------------------------------
export async function updateListing(id: number, formData: FormData): Promise<never> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect(`/dashboard/listings/edit/${id}?error=Unauthorized`);
  }

  const area = formData.get('area') as string | null;
  if (!area?.trim()) {
    redirect(`/dashboard/listings/edit/${id}?error=Area+is+required`);
  }

  const price = formData.get('price') as string | null;
  if (!price?.trim()) {
    redirect(`/dashboard/listings/edit/${id}?error=Price+is+required`);
  }

  const cityId = formData.get('cityId') as string | null;
  if (!cityId?.trim()) {
    redirect(`/dashboard/listings/edit/${id}?error=City+is+required`);
  }

  const regionId = formData.get('regionId') as string | null;
  if (!regionId?.trim()) {
    redirect(`/dashboard/listings/edit/${id}?error=Region+is+required`);
  }

  const featuresRaw = formData.get('features') as string | null;
  const imageUrlsRaw = formData.get('imageUrls') as string | null;

  const body = {
    id,
    title: formData.get('title') as string | null,
    description: formData.get('description') as string | null,
    area: parseFloat(area!),
    price: parseFloat(price!),
    cityId: parseInt(cityId!, 10),
    regionId: parseInt(regionId!, 10),
    address: formData.get('address') as string | null,
    googleMapsLink: formData.get('googleMapsLink') as string | null,
    landTypeId: parseOptionalInt(formData.get('landTypeId') as string | null),
    landFacingId: parseOptionalInt(formData.get('landFacingId') as string | null),
    ownershipStatusId: parseOptionalInt(formData.get('ownershipStatusId') as string | null),
    deedTypeId: parseOptionalInt(formData.get('deedTypeId') as string | null),
    neighborTypeId: parseOptionalInt(formData.get('neighborTypeId') as string | null),
    classificationId: parseOptionalInt(formData.get('classificationId') as string | null),
    features: featuresRaw ? JSON.parse(featuresRaw) : null,
    imageUrls: imageUrlsRaw ? JSON.parse(imageUrlsRaw) : null,
    explanatoryVideoUrl: formData.get('explanatoryVideoUrl') as string | null,
    titleDeedUrl: formData.get('titleDeedUrl') as string | null,
    nationalIdCopyUrl: formData.get('nationalIdCopyUrl') as string | null,
    landSurveyReportUrl: formData.get('landSurveyReportUrl') as string | null,
    statusId: parseOptionalInt(formData.get('statusId') as string | null),
    userId: parseOptionalInt(formData.get('userId') as string | null),
    agentId: parseOptionalInt(formData.get('agentId') as string | null),
    buyerId: parseOptionalInt(formData.get('buyerId') as string | null),
    purchasedPrice: parseOptionalFloat(formData.get('purchasedPrice') as string | null),
    reason: formData.get('reason') as string | null,
  };

  try {
    const res = await fetch(`${API_URL}/land/update`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken as string),
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!json.succeeded) {
      const msg = encodeURIComponent(json.message ?? json.errors?.[0] ?? 'Operation failed');
      redirect(`/dashboard/listings/edit/${id}?error=${msg}`);
    }

    revalidatePath('/dashboard/listings');
    redirect('/dashboard/listings');
  } catch {
    redirect(`/dashboard/listings/edit/${id}?error=An+unexpected+error+occurred`);
  }
}

// ---------------------------------------------------------------------------
// classifyListing
// ---------------------------------------------------------------------------
export async function classifyListing(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const landId = formData.get('landId') as string | null;
  if (!landId?.trim()) {
    return { success: false, error: 'landId is required' };
  }

  const classificationId = formData.get('classificationId') as string | null;
  if (!classificationId?.trim()) {
    return { success: false, error: 'classificationId is required' };
  }

  const body = {
    landId: parseInt(landId, 10),
    classificationId: parseInt(classificationId, 10),
  };

  try {
    const res = await fetch(`${API_URL}/land/update-classification`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken as string),
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? json.errors?.[0] ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/listings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// changeListingPrice
// ---------------------------------------------------------------------------
export async function changeListingPrice(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized' };
  }

  const landId = formData.get('landId') as string | null;
  if (!landId?.trim()) {
    return { success: false, error: 'landId is required' };
  }

  const suggestedPrice = formData.get('suggestedPrice') as string | null;
  if (!suggestedPrice?.trim()) {
    return { success: false, error: 'suggestedPrice is required' };
  }

  const body = {
    landId: parseInt(landId, 10),
    suggestedPrice: parseFloat(suggestedPrice),
    reason: formData.get('reason') as string | null,
  };

  try {
    const res = await fetch(`${API_URL}/land/price-change-request`, {
      method: 'POST',
      headers: buildHeaders(session.accessToken as string),
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!json.succeeded) {
      return { success: false, error: json.message ?? json.errors?.[0] ?? 'Operation failed' };
    }

    revalidatePath('/dashboard/listings');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseOptionalInt(value: string | null): number | null {
  if (!value?.trim()) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

function parseOptionalFloat(value: string | null): number | null {
  if (!value?.trim()) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}
