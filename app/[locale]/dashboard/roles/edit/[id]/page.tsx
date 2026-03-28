import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";
import { notFound } from "next/navigation";
import EditRoleModal from "@/components/features/roles/EditRoleModal";
import type { RoleDetailsDto, PageWithClaimsDto } from "@/types/role";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: Props) {
  const { id } = await params;

  const [role, pagesWithClaims] = await Promise.all([
    fetchApi<RoleDetailsDto>(`/roles/${id}`, { noStore: true }).catch(() => null),
    fetchApi<{ value: PageWithClaimsDto[] }>("/roles/pages-with-claims", {
      revalidate: CACHE_TTL.REFERENCE,
      tags: [CACHE_TAGS.ROLES_CLAIMS],
    }).then(data => data?.value ?? []).catch(() => [] as PageWithClaimsDto[]),
  ]);

  if (!role) notFound();

  return <EditRoleModal roleId={parseInt(id)} role={role} pagesWithClaims={pagesWithClaims} />;
}
