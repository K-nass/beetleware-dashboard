"use client";

import { useActionState, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Faq } from "@/types/settings";
import { reorderFaqs } from "@/app/actions/settings";
import FaqList from "./FaqList";
import type { ActionResponse } from "@/app/actions/types";

export default function FaqTab({ initialData }: { initialData: Faq[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>(initialData);

  const [state, formAction, isPending] = useActionState<ActionResponse<void> | null, FormData>(reorderFaqs, null);

  const locale = pathname.split("/")[1] || "en";

  const handleAdd = () => router.push(`${pathname}/add`);
  const handleEdit = (faq: Faq) => router.push(`${pathname}/edit/${faq.id}`);
  const handleDelete = (faq: Faq) => router.push(`${pathname}/delete/${faq.id}`);

  const handleReorder = (reorderedFaqs: Faq[]) => {
    setFaqs(reorderedFaqs);
    const form = document.getElementById("faq-reorder-form") as HTMLFormElement | null;
    if (form) {
      (form.querySelector('input[name="orderedIds"]') as HTMLInputElement).value = JSON.stringify(
        reorderedFaqs.map((f) => f.id)
      );
      form.requestSubmit();
    }
  };

  // Revert on error
  if (state && !state.success) {
    setFaqs(initialData);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">FAQ Management</h2>
          <p className="mt-1 text-sm text-gray-500">Drag and drop to reorder FAQs or use the arrow buttons</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add FAQ
        </button>
      </div>

      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          FAQs reordered successfully
        </div>
      )}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span>{state.error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <X className="h-6 w-6 text-red-500" />
          </button>
        </div>
      )}

      <form id="faq-reorder-form" action={formAction} className="hidden">
        <input type="hidden" name="orderedIds" defaultValue="[]" />
      </form>

      <FaqList
        faqs={faqs}
        isLoading={isPending}
        locale={locale}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  );
}
