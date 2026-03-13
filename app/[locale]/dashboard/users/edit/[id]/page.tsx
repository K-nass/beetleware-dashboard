import EditUserModal from "@/components/features/users/EditUserModal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditUserPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id, locale } = await params;
  
  return (
    <div className="space-y-6">
      <Link
        href={`/${locale}/dashboard/users`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>
      
      <EditUserModal userId={id} locale={locale} isFullPage={true} />
    </div>
  );
}
