import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import CommunicationsTab from "@/components/features/settings/communications/CommunicationsTab";

export default async function CommunicationsPage() {
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/communicationssettings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) redirect("/login");
    throw new Error("Failed to fetch communications settings");
  }

  const result = await res.json();
  if (!result.succeeded) throw new Error(result.message || "Failed to fetch communications settings");

  return <CommunicationsTab initialData={result.data} />;
}
