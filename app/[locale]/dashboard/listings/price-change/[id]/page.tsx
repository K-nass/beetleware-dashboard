import PriceChangeForm from "@/components/features/listings/PriceChangeForm";

interface PriceChangePageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function PriceChangePage({ params }: PriceChangePageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Request Price Change</h1>
      <div className="max-w-md">
        <PriceChangeForm landId={id} isModal={false} />
      </div>
    </div>
  );
}
