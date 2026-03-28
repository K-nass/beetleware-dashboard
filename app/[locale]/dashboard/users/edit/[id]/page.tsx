import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditUserModal from "@/components/features/users/EditUserModal";
import { fetchApi } from "@/lib/api/fetch-api";
import { UserDetails } from "@/types/user";

interface EditUserPageProps {
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

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id, locale } = await params;

  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/dashboard/users`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      <EditUserModal user={user} isFullPage={true} />
    </div>
  );
}
