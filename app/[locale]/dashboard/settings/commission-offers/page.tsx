import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";
import { CommissionOfferSettings } from "@/types/settings";
import CommissionOfferTab from "@/components/features/settings/commission-offer/CommissionOfferTab";

export default async function CommissionOffersPage() {
  const data = await fetchApi<CommissionOfferSettings>("/commissionoffersettings", {
    revalidate: CACHE_TTL.SETTINGS,
    tags: [CACHE_TAGS.COMMISSION_SETTINGS],
  });

  return <CommissionOfferTab initialData={data} />;
}
