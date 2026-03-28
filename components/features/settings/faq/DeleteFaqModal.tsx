"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { deleteFaq } from "@/app/actions/settings";
import { Faq } from "@/types/settings";
import type { ActionResponse } from "@/app/actions/types";

interface DeleteFaqModalProps {
  faq: Faq;
}

export default function DeleteFaqModal({ faq }: DeleteFaqModalProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse<void> | null, FormData>(deleteFaq, null);

  if (state?.success) {
    router.back();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !isPending) router.back(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-800">Delete FAQ</h2>
          </div>
          <button
            onClick={() => router.back()}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {state.error}
            </div>
          )}
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Question (EN):</span>
              <p className="text-gray-900 font-medium">{faq.questionEn}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Question (AR):</span>
              <p className="text-gray-900" dir="rtl">{faq.questionAr}</p>
            </div>
          </div>
          <form action={formAction}>
            <input type="hidden" name="id" value={faq.id} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? "Deleting..." : "Delete FAQ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
