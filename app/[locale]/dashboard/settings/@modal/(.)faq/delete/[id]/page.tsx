import { fetchApi } from "@/lib/api/fetch-api";
import { notFound } from "next/navigation";
import DeleteFaqModal from "@/components/features/settings/faq/DeleteFaqModal";
import { Faq } from "@/types/settings";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteFaqModalPage({ params }: Props) {
  const { id } = await params;

  let list: Faq[] = [];
  try {
    const data = await fetchApi<{ items: Faq[] }>("/faq/list", { noStore: true });
    list = data?.items ?? [];
  } catch {
    notFound();
  }
  const faq = list.find((f: Faq) => f.id === parseInt(id));
  if (!faq) notFound();

  return <DeleteFaqModal faq={faq} />;
}
