import { fetchApi } from "@/lib/api/fetch-api";
import { notFound } from "next/navigation";
import EditFaqModalRoute from "@/components/features/settings/faq/EditFaqModalRoute";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;

  let list: any[] = [];
  try {
    const data = await fetchApi<{ items: any[] }>("/faq/list", { noStore: true });
    list = data?.items ?? [];
  } catch {
    notFound();
  }
  const faq = list.find((f: any) => f.id === parseInt(id));
  if (!faq) notFound();

  return <EditFaqModalRoute faq={faq} />;
}
