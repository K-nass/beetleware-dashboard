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
export async function addListing(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const fields = getFields(formData);
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized', fields };
  }

  const title = formData.get('title') as string | null;
  if (!title?.trim()) {
    return { success: false, error: 'Title is required', fields };
  }

  const area = formData.get('area') as string | null;
  if (!area?.trim()) {
    return { success: false, error: 'Area is required', fields };
  }

  const price = formData.get('price') as string | null;
  if (!price?.trim()) {
    return { success: false, error: 'Price is required', fields };
  }

  const cityId = formData.get('cityId') as string | null;
  if (!cityId?.trim()) {
    return { success: false, error: 'City is required', fields };
  }

  const regionId = formData.get('regionId') as string | null;
  if (!regionId?.trim()) {
    return { success: false, error: 'Region is required', fields };
  }

  // Optional array fields — accept either JSON array or comma-separated string
  const featuresRaw = formData.get('features') as string | null;
  const imageUrlsRaw = formData.get('imageUrls') as string | null;

  const features = parseArrayField(featuresRaw);
  const imageUrls = parseArrayField(imageUrlsRaw);

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
    features,
    imageUrls,
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
      return { success: false, error: json.message ?? json.errors?.[0] ?? 'Operation failed', fields };
    }

    revalidatePath('/dashboard/listings');
  } catch (error) {
    if ((error as any)?.digest?.includes('NEXT_REDIRECT')) throw error;
    return { success: false, error: 'An unexpected error occurred', fields };
  }

  redirect('/dashboard/listings');
}

// ---------------------------------------------------------------------------
// updateListing
// ---------------------------------------------------------------------------
export async function updateListing(_prevState: ActionResponse<void> | null, formData: FormData): Promise<ActionResponse<void>> {
  const fields = getFields(formData);
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return { success: false, error: 'Unauthorized', fields };
  }

  const idRaw = formData.get('id') as string | null;
  if (!idRaw?.trim()) {
    return { success: false, error: 'ID is required', fields };
  }
  const id = parseInt(idRaw, 10);

  const area = formData.get('area') as string | null;
  if (!area?.trim()) {
    return { success: false, error: 'Area is required', fields };
  }

  const price = formData.get('price') as string | null;
  if (!price?.trim()) {
    return { success: false, error: 'Price is required', fields };
  }

  const cityId = formData.get('cityId') as string | null;
  if (!cityId?.trim()) {
    return { success: false, error: 'City is required', fields };
  }

  const regionId = formData.get('regionId') as string | null;
  if (!regionId?.trim()) {
    return { success: false, error: 'Region is required', fields };
  }

  const featuresRaw = formData.get('features') as string | null;
  const imageUrlsRaw = formData.get('imageUrls') as string | null;

  const features = parseArrayField(featuresRaw);
  const imageUrls = parseArrayField(imageUrlsRaw);

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
    features,
    imageUrls,
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
      return { success: false, error: json.message ?? json.errors?.[0] ?? 'Operation failed', fields };
    }

    revalidatePath('/dashboard/listings');
  } catch (error) {
    if ((error as any)?.digest?.includes('NEXT_REDIRECT')) throw error;
    return { success: false, error: 'An unexpected error occurred', fields };
  }

  redirect('/dashboard/listings');
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

function parseArrayField(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
}

function getFields(formData: FormData): Record<string, string> {
  const fields: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string') {
      fields[key] = value;
    }
  });
  return fields;
}
