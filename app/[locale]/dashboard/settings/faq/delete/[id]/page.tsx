import DeleteFaqModal from "@/components/features/settings/faq/DeleteFaqModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteFaqPage({ params }: Props) {
  const { id } = await params;
  return <DeleteFaqModal faqId={parseInt(id)} />;
}
