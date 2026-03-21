import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { notFound } from "next/navigation";
import DeleteRoleModal from "@/components/features/roles/DeleteRoleModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteRolePage({ params }: Props) {
  const { id } = await params;
  const token = await getServerAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) notFound();
  const json = await res.json();
  if (!json.succeeded || !json.data) notFound();

  return <DeleteRoleModal roleId={parseInt(id)} role={json.data} />;
}
