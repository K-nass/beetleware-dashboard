import { getServerAccessToken } from "@/lib/auth/get-server-token";
import AddRoleModal from "@/components/features/roles/AddRoleModal";

export default async function AddRoleModalPage() {
  const token = await getServerAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/pages-with-claims`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  const json = res.ok ? await res.json() : null;
  const pagesWithClaims = json?.succeeded
    ? (json.data?.value ?? json.data ?? [])
    : [];

  return <AddRoleModal pagesWithClaims={pagesWithClaims} />;
}
