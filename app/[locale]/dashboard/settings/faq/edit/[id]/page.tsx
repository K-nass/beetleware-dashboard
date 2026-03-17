import EditFaqModalRoute from "@/components/features/settings/faq/EditFaqModalRoute";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;
  return <EditFaqModalRoute faqId={parseInt(id)} />;
}
