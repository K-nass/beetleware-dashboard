import { Suspense } from "react";
import PageHeader from "../../../../../../components/features/dashboard/pageHeader/PageHeader";
import EditListingForm from "@/components/features/listings/EditListingForm";

interface EditListingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Listing" 
        description="Update listing information" 
      />
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Loading listing form...</div>
        </div>
      }>
        <EditListingForm listingId={id} />
      </Suspense>
    </div>
  );
}