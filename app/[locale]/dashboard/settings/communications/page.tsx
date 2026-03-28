import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";
import { CommunicationsSettings } from "@/types/settings";
import CommunicationsTab from "@/components/features/settings/communications/CommunicationsTab";

export default async function CommunicationsPage() {
  const data = await fetchApi<CommunicationsSettings>("/communicationssettings", {
    revalidate: CACHE_TTL.SETTINGS,
    tags: [CACHE_TAGS.COMMUNICATIONS_SETTINGS],
  });

  return <CommunicationsTab initialData={data} />;
}
