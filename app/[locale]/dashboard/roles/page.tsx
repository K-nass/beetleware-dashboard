import RolesContent from "@/components/features/roles/RolesContent";

export const metadata = {
  title: "Roles & Permissions",
  description: "Manage user roles and their permissions"
};

export default function RolesPage() {
  return (
    <div className="p-6">
      <RolesContent />
    </div>
  );
}
