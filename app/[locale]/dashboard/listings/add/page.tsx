import AddListingForm from "@/components/features/listings/AddListingForm";
import { fetchLookupDataServer, fetchLandClassificationsServer } from "@/lib/api/lookup";

interface AddListingPageProps {
  searchParams: Promise<{}>;
}

export default async function AddListingPage({ searchParams }: AddListingPageProps) {
  const [lookupData, classifications] = await Promise.all([
    fetchLookupDataServer(),
    fetchLandClassificationsServer(),
  ]);  

  lookupData.landClassifications = classifications;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Listing</h1>
        <p className="text-gray-600 mt-2">Create a new land listing</p>
      </div>
      <AddListingForm lookupData={lookupData} />
    </div>
  );
}
