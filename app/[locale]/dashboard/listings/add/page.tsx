import AddListingForm from "@/components/features/listings/AddListingForm";

export default function AddListingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Listing</h1>
        <p className="text-gray-600 mt-2">Create a new land listing</p>
      </div>
      <AddListingForm />
    </div>
  );
}
