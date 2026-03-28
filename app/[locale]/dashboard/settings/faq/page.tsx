import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";
import FaqTab from "@/components/features/settings/faq/FaqTab";

export default async function FaqPage() {
  const data = await fetchApi<{ items: any[] }>("/faq/list", {
    revalidate: CACHE_TTL.SETTINGS,
    tags: [CACHE_TAGS.FAQ],
  });

  return <FaqTab initialData={data?.items ?? []} />;
}
