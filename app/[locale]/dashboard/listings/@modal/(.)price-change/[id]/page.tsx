import PriceChangeModal from "@/components/features/listings/PriceChangeModal";

interface PriceChangeModalPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function PriceChangeModalPage({ params }: PriceChangeModalPageProps) {
  const { id } = await params;
  return <PriceChangeModal landId={id} />;
}
