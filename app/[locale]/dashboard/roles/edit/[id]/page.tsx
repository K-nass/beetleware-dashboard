import EditRoleModal from "@/components/features/roles/EditRoleModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: Props) {
  const { id } = await params;
  return <EditRoleModal roleId={parseInt(id)} />;
}
