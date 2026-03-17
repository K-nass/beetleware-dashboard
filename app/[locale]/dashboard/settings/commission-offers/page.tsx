import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import CommissionOfferTab from "@/components/features/settings/commission-offer/CommissionOfferTab";

export default async function CommissionOffersPage() {
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/commissionoffersettings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) redirect("/login");
    throw new Error("Failed to fetch commission settings");
  }

  const result = await res.json();
  if (!result.succeeded) throw new Error(result.message || "Failed to fetch commission settings");

  return <CommissionOfferTab initialData={result.data} />;
}
