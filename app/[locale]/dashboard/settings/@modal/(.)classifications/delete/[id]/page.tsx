import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { notFound } from "next/navigation";
import DeleteLandClassificationModal from "@/components/features/settings/land-classifications/DeleteLandClassificationModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteClassificationModalPage({ params }: Props) {
  const { id } = await params;
  const token = await getServerAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land-classifications`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) notFound();
  const json = await res.json();
  const list: any[] = json?.data?.value ?? json?.data ?? [];
  const classification = list.find((c: any) => c.id === parseInt(id));
  if (!classification) notFound();

  return <DeleteLandClassificationModal classification={classification} />;
}
