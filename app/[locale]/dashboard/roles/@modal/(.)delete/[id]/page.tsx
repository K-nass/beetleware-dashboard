import DeleteRoleModal from "@/components/features/roles/DeleteRoleModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteRoleModalPage({ params }: Props) {
  const { id } = await params;
  return <DeleteRoleModal roleId={parseInt(id)} />;
}
