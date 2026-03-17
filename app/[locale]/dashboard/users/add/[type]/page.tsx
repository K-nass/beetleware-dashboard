import AddUserModal from "@/components/features/users/AddUserModal";

interface Props {
  params: Promise<{ type: string }>;
}

export default async function AddUserPage({ params }: Props) {
  const { type } = await params;
  return <AddUserModal userType={type === "external" ? "external" : "internal"} />;
}
