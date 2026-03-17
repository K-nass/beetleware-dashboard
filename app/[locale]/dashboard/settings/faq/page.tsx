import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import FaqTab from "@/components/features/settings/faq/FaqTab";

export default async function FaqPage() {
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/list`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) redirect("/login");
    throw new Error("Failed to fetch FAQs");
  }

  const result = await res.json();
  if (!result.succeeded) throw new Error(result.message || "Failed to fetch FAQs");

  return <FaqTab initialData={result.data.items ?? result.data} />;
}
