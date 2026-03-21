"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { updateFaq } from "@/app/actions/settings";
import { Faq } from "@/types/settings";

interface EditFaqModalProps {
  faq: Faq;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locale: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Updating..." : "Update FAQ"}
    </button>
  );
}

export default function EditFaqModal({
  faq,
  isOpen,
  onClose,
  onSuccess,
  locale,
}: EditFaqModalProps) {
  const [state, formAction] = useActionState(updateFaq, null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Edit FAQ
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {state?.success === false && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              FAQ updated successfully
            </div>
          )}

          {!state?.success && (
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="id" value={faq.id} />

              <div>
                <label htmlFor="questionEn" className="block text-sm font-medium text-gray-700 mb-1">
                  Question (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="questionEn"
                  name="questionEn"
                  defaultValue={faq.questionEn}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What is your question?"
                />
              </div>

              <div>
                <label htmlFor="questionAr" className="block text-sm font-medium text-gray-700 mb-1">
                  Question (Arabic) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="questionAr"
                  name="questionAr"
                  defaultValue={faq.questionAr}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ما هو سؤالك؟"
                  dir="rtl"
                />
              </div>

              <div>
                <label htmlFor="answerEn" className="block text-sm font-medium text-gray-700 mb-1">
                  Answer (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="answerEn"
                  name="answerEn"
                  defaultValue={faq.answerEn}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide a detailed answer..."
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="answerAr" className="block text-sm font-medium text-gray-700 mb-1">
                  Answer (Arabic) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="answerAr"
                  name="answerAr"
                  defaultValue={faq.answerAr}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="قدم إجابة مفصلة..."
                  dir="rtl"
                  rows={4}
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current Display Order:</span> {faq.displayOrder}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Use drag-and-drop or arrow buttons in the list to change the order
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <SubmitButton />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
