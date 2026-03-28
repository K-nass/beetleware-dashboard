import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";
import FaqTab from "@/components/features/settings/faq/FaqTab";
import { Faq } from "@/types/settings";

export default async function FaqPage() {
  const data = await fetchApi<{ items: Faq[] }>("/faq/list", {
    revalidate: CACHE_TTL.SETTINGS,
    tags: [CACHE_TAGS.FAQ],
  });

  return <FaqTab initialData={data?.items ?? []} />;
}
