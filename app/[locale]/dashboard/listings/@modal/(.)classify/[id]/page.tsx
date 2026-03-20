import ClassificationModal from "@/components/features/listings/ClassificationModal";
import { fetchClassificationsServer } from "@/lib/api/classifications-server";

interface ClassificationModalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ClassificationModalPage({ params }: ClassificationModalPageProps) {
  const { id } = await params;
  const classifications = await fetchClassificationsServer();
  return <ClassificationModal landId={id} classifications={classifications} />;
}
