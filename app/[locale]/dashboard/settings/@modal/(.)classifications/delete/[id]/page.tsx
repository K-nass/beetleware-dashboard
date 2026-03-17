import DeleteLandClassificationModal from "@/components/features/settings/land-classifications/DeleteLandClassificationModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteClassificationModalPage({ params }: Props) {
  const { id } = await params;
  return <DeleteLandClassificationModal classificationId={parseInt(id)} />;
}
