"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { createLandClassification } from "@/app/actions/settings";

interface AddLandClassificationModalProps {
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
      {pending ? "Creating..." : "Create Classification"}
    </button>
  );
}

export default function AddLandClassificationModal({
  isOpen,
  onClose,
  onSuccess,
  locale,
}: AddLandClassificationModalProps) {
  const [state, formAction] = useActionState(createLandClassification, null);
  const formRef = useRef<HTMLFormElement>(null);

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
      formRef.current?.reset();
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Add Land Classification
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {state && !state.success && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Land classification created successfully
            </div>
          )}

          {!state?.success && (
            <form ref={formRef} action={formAction} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., A, B, C"
                />
              </div>

              <div>
                <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Arabic) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameAr"
                  name="nameAr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="تصنيف أ"
                  dir="rtl"
                />
              </div>

              <div>
                <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
                  Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameEn"
                  name="nameEn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Classification A"
                />
              </div>

              <div>
                <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="discountPercent"
                  name="discountPercent"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  step="0.01"
                  defaultValue="0"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
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
