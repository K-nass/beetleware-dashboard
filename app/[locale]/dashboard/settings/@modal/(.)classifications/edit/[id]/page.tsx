import EditLandClassificationModalRoute from "@/components/features/settings/land-classifications/EditLandClassificationModalRoute";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditClassificationModalPage({ params }: Props) {
  const { id } = await params;
  return <EditLandClassificationModalRoute classificationId={parseInt(id)} />;
}
