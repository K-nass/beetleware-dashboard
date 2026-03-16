import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import SettingsContent from "@/components/features/settings/SettingsContent";

export const metadata = {
  title: "Platform Settings",
  description: "Configure platform rules and settings"
};

export default async function SettingsPage() {
  // Get access token from server session
  const token = await getServerAccessToken();
  
  // Redirect if not authenticated
  if (!token) {
    redirect("/login");
  }

  // Fetch all settings data in parallel
  const [
    landClassificationsRes,
    commissionOfferRes,
    communicationsRes,
    faqRes
  ] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/land-classifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/commissionoffersettings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/communicationssettings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/list`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }),
  ]);

  // Handle responses
  if (!landClassificationsRes.ok || !commissionOfferRes.ok || !communicationsRes.ok || !faqRes.ok) {
    if (landClassificationsRes.status === 401 || commissionOfferRes.status === 401 || 
        communicationsRes.status === 401 || faqRes.status === 401) {
      redirect("/login");
    }
    throw new Error('Failed to fetch settings data');
  }

  const [
    landClassificationsData,
    commissionOfferData,
    communicationsData,
    faqData
  ] = await Promise.all([
    landClassificationsRes.json(),
    commissionOfferRes.json(),
    communicationsRes.json(),
    faqRes.json(),
  ]);

  // Check if responses succeeded
  if (!landClassificationsData.succeeded) {
    throw new Error(landClassificationsData.message || 'Failed to fetch land classifications');
  }
  if (!commissionOfferData.succeeded) {
    throw new Error(commissionOfferData.message || 'Failed to fetch commission offer settings');
  }
  if (!communicationsData.succeeded) {
    throw new Error(communicationsData.message || 'Failed to fetch communications settings');
  }
  if (!faqData.succeeded) {
    throw new Error(faqData.message || 'Failed to fetch FAQs');
  }

  // Extract data based on actual API response structure
  const landClassifications = landClassificationsData.data.value;
  const commissionOffer = commissionOfferData.data;
  const communications = communicationsData.data;
  const faqs = faqData.data.items;

  return (
    <div className="p-6">
      <SettingsContent 
        initialLandClassifications={landClassifications}
        initialCommissionOffer={commissionOffer}
        initialCommunications={communications}
        initialFaqs={faqs}
      />
    </div>
  );
}
