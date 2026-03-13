import EditUserModal from "@/components/features/users/EditUserModal";

interface EditUserModalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function EditUserModalPage({ params }: EditUserModalPageProps) {
  const { id, locale } = await params;
  
  return <EditUserModal userId={id} locale={locale} />;
}
