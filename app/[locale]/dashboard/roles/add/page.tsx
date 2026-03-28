import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";
import AddRoleModal from "@/components/features/roles/AddRoleModal";
import type { PageWithClaimsDto } from "@/types/role";

export default async function AddRolePage() {
  const pagesWithClaims = await fetchApi<{ value: PageWithClaimsDto[] }>("/roles/pages-with-claims", {
    revalidate: CACHE_TTL.REFERENCE,
    tags: [CACHE_TAGS.ROLES_CLAIMS],
  }).then(data => data?.value ?? []).catch(() => [] as PageWithClaimsDto[]);

  return <AddRoleModal pagesWithClaims={pagesWithClaims} />;
}
