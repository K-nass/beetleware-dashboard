import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { notFound } from "next/navigation";
import EditUserModal from "@/components/features/users/EditUserModal";
import { UserDetails } from "@/types/user";

interface EditUserModalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

async function fetchUserById(id: string): Promise<UserDetails | null> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (!json.succeeded) return null;

  return json.data;
}

export default async function EditUserModalPage({ params }: EditUserModalPageProps) {
  const { id, locale } = await params;

  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return <EditUserModal user={user} locale={locale} />;
}
