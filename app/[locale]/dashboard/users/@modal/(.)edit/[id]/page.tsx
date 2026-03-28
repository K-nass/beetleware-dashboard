import { notFound } from "next/navigation";
import EditUserModal from "@/components/features/users/EditUserModal";
import { fetchApi } from "@/lib/api/fetch-api";
import { UserDetails } from "@/types/user";

interface EditUserModalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

async function fetchUserById(id: string): Promise<UserDetails | null> {
  try {
    return await fetchApi<UserDetails>(`/users/${id}`, { noStore: true });
  } catch {
    return null;
  }
}

export default async function EditUserModalPage({ params }: EditUserModalPageProps) {
  const { id, locale } = await params;

  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return <EditUserModal user={user} />;
}
