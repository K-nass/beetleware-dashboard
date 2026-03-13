import { Suspense } from "react";
import PageHeader from "../../../../components/features/dashboard/pageHeader/PageHeader";
import ListingsContent from "@/components/features/listings/ListingsContent";

export default function ListingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Listings Management" 
        description="Manage property listings and approvals"
        buttonText="Add Listing"
        buttonHref="/dashboard/listings/add"
      />
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Loading listings...</div>
        </div>
      }>
        <ListingsContent />
      </Suspense>
    </div>
  );
}