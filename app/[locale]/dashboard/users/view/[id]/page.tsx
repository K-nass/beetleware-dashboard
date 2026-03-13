import ViewUserModal from "@/components/features/users/ViewUserModal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ViewUserPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ViewUserPage({ params }: ViewUserPageProps) {
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
      
      <ViewUserModal userId={id} locale={locale} isFullPage={true} />
    </div>
  );
}
