import { getServerAccessToken } from "@/lib/auth/get-server-token";
import CommunicationsTab from "@/components/features/settings/communications/CommunicationsTab";

export default async function CommunicationsPage() {
  const token = await getServerAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/communicationssettings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch communications settings");
  }

  const result = await res.json();
  if (!result.succeeded) throw new Error(result.message || "Failed to fetch communications settings");

  return <CommunicationsTab initialData={result.data} />;
}
