import { Suspense } from "react";
import PageHeader from "@/components/features/dashboard/pageHeader/PageHeader";
import UsersContent from "@/components/features/users/UsersContent";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="Manage internal and external users"
        buttonText="Add User"
        buttonHref="#add-user"
      />
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Loading users...</div>
        </div>
      }>
        <UsersContent />
      </Suspense>
    </div>
  );
}
