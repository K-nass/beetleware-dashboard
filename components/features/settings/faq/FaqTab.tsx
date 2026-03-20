"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Faq } from "@/types/settings";
import { reorderFaqs } from "@/app/actions/settings";
import FaqList from "./FaqList";

export default function FaqTab({ initialData }: { initialData: Faq[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const locale = pathname.split('/')[1] || 'en';

  const handleAdd = () => router.push(`${pathname}/add`);
  const handleEdit = (faq: Faq) => router.push(`${pathname}/edit/${faq.id}`);
  const handleDelete = (faq: Faq) => router.push(`${pathname}/delete/${faq.id}`);

  const handleReorder = (reorderedFaqs: Faq[]) => {
    setFaqs(reorderedFaqs);
    startTransition(async () => {
      const orderedIds = reorderedFaqs.map((faq) => faq.id);
      const result = await reorderFaqs(orderedIds);
      if (result.success) {
        setSuccessMessage('FAQs reordered successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.error ?? 'An error occurred while reordering FAQs');
        setFaqs(initialData);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{successMessage}</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      <FaqList
        faqs={faqs}
        isLoading={false}
        locale={locale}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  );
}
