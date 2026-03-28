import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { notFound } from "next/navigation";
import EditLandClassificationModalRoute from "@/components/features/settings/land-classifications/EditLandClassificationModalRoute";
import { LandClassification } from "@/types/settings";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditClassificationPage({ params }: Props) {
  const { id } = await params;
  const token = await getServerAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land-classifications`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) notFound();
  const json = await res.json();
  const list: LandClassification[] = json?.data?.value ?? json?.data ?? [];
  const classification = list.find((c: LandClassification) => c.id === parseInt(id));
  if (!classification) notFound();

  return <EditLandClassificationModalRoute classification={classification} />;
}
