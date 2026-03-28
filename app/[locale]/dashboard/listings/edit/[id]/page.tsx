import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../../components/features/dashboard/pageHeader/PageHeader";
import EditListingForm, { ListingData } from "@/components/features/listings/EditListingForm";
import { fetchLookupDataServer, fetchLandClassificationsServer } from "@/lib/api/lookup";
import { fetchApi } from "@/lib/api/fetch-api";
import { Loader } from "lucide-react";

interface EditListingPageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{}>;
}

async function fetchListing(id: string): Promise<ListingData | null> {
  try {
    return await fetchApi<ListingData>(`/land/${id}`, { noStore: true });
  } catch {
    return null;
  }
}

export default async function EditListingPage({ params, searchParams }: EditListingPageProps) {
  const { id } = await params;
  const [listing, lookupData, classifications] = await Promise.all([
    fetchListing(id),
    fetchLookupDataServer(),
    fetchLandClassificationsServer(),
  ]);

  if (lookupData) {
    lookupData.landClassifications = classifications;
  }

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Listing"
        description="Update listing information"
      />

      <Suspense
        fallback={
          <Loader />
        }
      >
        <EditListingForm listing={listing} lookupData={lookupData} />
      </Suspense>
    </div>
  );
}
