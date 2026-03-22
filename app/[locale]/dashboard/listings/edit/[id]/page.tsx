import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../../components/features/dashboard/pageHeader/PageHeader";
import EditListingForm from "@/components/features/listings/EditListingForm";
import { fetchLookupDataServer, fetchLandClassificationsServer } from "@/lib/api/lookup";
import { Loader } from "lucide-react";

interface EditListingPageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{}>;
}

async function fetchListing(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/land/${id}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (!json.succeeded) return null;

  return json.data;
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
