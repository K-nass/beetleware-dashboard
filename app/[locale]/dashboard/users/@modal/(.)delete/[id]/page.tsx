import DeleteUserModal from "@/components/features/users/DeleteUserModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteUserModalPage({ params }: Props) {
  const { id } = await params;
  return <DeleteUserModal userId={parseInt(id)} />;
}
