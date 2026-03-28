import { fetchApi } from "@/lib/api/fetch-api";
import { notFound } from "next/navigation";
import DeleteRoleModal from "@/components/features/roles/DeleteRoleModal";
import type { RoleDetailsDto } from "@/types/role";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteRoleModalPage({ params }: Props) {
  const { id } = await params;

  const role = await fetchApi<RoleDetailsDto>(`/roles/${id}`, { noStore: true }).catch(() => null);

  if (!role) notFound();

  return <DeleteRoleModal roleId={parseInt(id)} role={role} />;
}
