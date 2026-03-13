import ViewUserModal from "@/components/features/users/ViewUserModal";

interface ViewUserModalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ViewUserModalPage({ params }: ViewUserModalPageProps) {
  const { id, locale } = await params;
  
  return <ViewUserModal userId={id} locale={locale} />;
}
