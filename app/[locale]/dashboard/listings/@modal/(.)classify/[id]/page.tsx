import ClassificationModal from "@/components/features/listings/ClassificationModal";

interface ClassificationModalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ClassificationModalPage({ params }: ClassificationModalPageProps) {
  const { id } = await params;
  return <ClassificationModal landId={id} />;
}
