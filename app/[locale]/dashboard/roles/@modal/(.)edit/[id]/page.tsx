import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect, notFound } from "next/navigation";
import EditRoleModal from "@/components/features/roles/EditRoleModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRoleModalPage({ params }: Props) {
  const { id } = await params;
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [roleRes, pagesRes] = await Promise.all([
    fetch(`${baseUrl}/roles/${id}`, { headers, cache: "no-store" }),
    fetch(`${baseUrl}/roles/pages-with-claims`, { headers, cache: "no-store" }),
  ]);

  if (!roleRes.ok) notFound();
  const roleJson = await roleRes.json();
  if (!roleJson.succeeded || !roleJson.data) notFound();

  const pagesJson = pagesRes.ok ? await pagesRes.json() : null;
  const pagesWithClaims = pagesJson?.succeeded
    ? (pagesJson.data?.value ?? pagesJson.data ?? [])
    : [];

  return <EditRoleModal roleId={parseInt(id)} role={roleJson.data} pagesWithClaims={pagesWithClaims} />;
}
