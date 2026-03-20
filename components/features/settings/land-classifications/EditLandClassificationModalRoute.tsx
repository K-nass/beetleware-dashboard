"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { updateLandClassification } from "@/app/actions/settings";
import { LandClassification } from "@/types/settings";

interface EditLandClassificationModalRouteProps {
  classification: LandClassification;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Updating..." : "Update Classification"}
    </button>
  );
}

export default function EditLandClassificationModalRoute({ classification }: EditLandClassificationModalRouteProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateLandClassification, null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => router.back(), 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) router.back(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {state?.success ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600">Classification updated successfully</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Edit Land Classification</h2>
              <button
                onClick={() => router.back()}
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
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="id" value={classification.id} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={classification.code}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">Code cannot be changed</p>
                </div>
                <div>
                  <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">
                    Name (Arabic) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nameAr"
                    name="nameAr"
                    defaultValue={classification.nameAr}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    defaultValue={classification.nameEn}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    defaultValue={classification.discountPercent}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <SubmitButton />
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
