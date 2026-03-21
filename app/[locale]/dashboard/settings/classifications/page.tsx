import { getServerAccessToken } from "@/lib/auth/get-server-token";
import LandClassificationsTab from "@/components/features/settings/land-classifications/LandClassificationsTab";

export default async function ClassificationsPage() {
  const token = await getServerAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land-classifications`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch land classifications");
  }

  const result = await res.json();
  if (!result.succeeded) throw new Error(result.message || "Failed to fetch land classifications");

  return <LandClassificationsTab initialData={result.data.value ?? result.data} />;
}
