import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect, notFound } from "next/navigation";
import DeleteFaqModal from "@/components/features/settings/faq/DeleteFaqModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteFaqPage({ params }: Props) {
  const { id } = await params;
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/list`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) notFound();
  const json = await res.json();
  const list: any[] = json?.data?.items ?? [];
  const faq = list.find((f: any) => f.id === parseInt(id));
  if (!faq) notFound();

  return <DeleteFaqModal faq={faq} />;
}
