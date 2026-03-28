import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";
import AddRoleModal from "@/components/features/roles/AddRoleModal";
import type { PageWithClaimsDto } from "@/types/role";

export default async function AddRoleModalPage() {
  const pagesWithClaims = await fetchApi<PageWithClaimsDto[]>("/roles/pages-with-claims", {
    revalidate: CACHE_TTL.REFERENCE,
    tags: [CACHE_TAGS.ROLES_CLAIMS],
  }).catch(() => [] as PageWithClaimsDto[]);

  return <AddRoleModal pagesWithClaims={pagesWithClaims} />;
}
