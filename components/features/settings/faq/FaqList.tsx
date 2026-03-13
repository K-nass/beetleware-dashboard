"use client";

import { Edit2, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Faq } from "@/types/settings";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface FaqListProps {
  faqs: Faq[];
  isLoading: boolean;
  locale: string;
  onEdit: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
  onReorder: (reorderedFaqs: Faq[]) => void;
}

interface SortableFaqItemProps {
  faq: Faq;
  index: number;
  totalItems: number;
  locale: string;
  onEdit: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

function SortableFaqItem({
  faq,
  index,
  totalItems,
  locale,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}: SortableFaqItemProps) {
  const { ref, handleRef, sortable } = useSortable({ id: faq.id, index });

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg border border-gray-200 p-4 transition-all ${
        sortable.isDragging ? "opacity-50 shadow-lg z-10" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle & Manual Controls */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div
            ref={handleRef}
            className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === totalItems - 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {locale === "ar" ? faq.questionAr : faq.questionEn}
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {locale === "ar" ? faq.answerAr : faq.answerEn}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Order: {faq.displayOrder}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onEdit(faq)}
                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(faq)}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqList({
  faqs,
  isLoading,
  locale,
  onEdit,
  onDelete,
  onReorder
}: FaqListProps) {
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newFaqs = [...faqs];
    [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
    onReorder(newFaqs.map((faq, idx) => ({ ...faq, displayOrder: idx + 1 })));
  };

  const handleMoveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    const newFaqs = [...faqs];
    [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    onReorder(newFaqs.map((faq, idx) => ({ ...faq, displayOrder: idx + 1 })));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new FAQ.</p>
      </div>
    );
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;
        const { source, target } = event.operation;

        if (!source || !target || source.id === target.id) return;

        const oldIndex = faqs.findIndex((f) => f.id === source.id);
        const newIndex = faqs.findIndex((f) => f.id === target.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newFaqs = [...faqs];
          const [movedItem] = newFaqs.splice(oldIndex, 1);
          newFaqs.splice(newIndex, 0, movedItem);

          onReorder(newFaqs.map((f, i) => ({ ...f, displayOrder: i + 1 })));
        }
      }}
    >
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <SortableFaqItem
            key={faq.id}
            faq={faq}
            index={index}
            totalItems={faqs.length}
            locale={locale}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
