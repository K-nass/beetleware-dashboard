import ClassificationForm from "@/components/features/listings/ClassificationForm";

interface ClassificationPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ClassificationPage({ params }: ClassificationPageProps) {
  const { id } = await params;
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Classification</h1>
      <ClassificationForm landId={id} isModal={false} />
    </div>
  );
}
