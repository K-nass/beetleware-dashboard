import { Suspense } from "react";
import PageHeader from "../../components/dashboard/pageHeader/PageHeader";
import ListingsContent from "../../components/listings/ListingsContent";

export default function ListingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Listings Management" 
        description="Manage property listings and approvals" 
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