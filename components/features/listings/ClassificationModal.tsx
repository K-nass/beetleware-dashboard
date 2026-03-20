"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { classifyListing } from "@/app/actions/listings";
import type { Classification } from "@/lib/api/classifications";

interface ClassificationModalProps {
  landId: string;
  classifications: Classification[];
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Saving...</span>
        </>
      ) : (
        "Save"
      )}
    </button>
  );
}

export default function ClassificationModal({ landId, classifications }: ClassificationModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const [state, action] = useActionState(classifyListing, null);

  // Auto-close on success after 2 seconds
  useEffect(() => {
    if (state?.success === true) {
      const timer = setTimeout(() => router.back(), 2000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (firstFocusableRef.current && state?.success !== true) {
      firstFocusableRef.current.focus();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state?.success !== true) handleClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [state]);

  // Focus trap
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, []);

  const handleClose = () => router.back();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && state?.success !== true) handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Update Classification
          </h2>
          <button
            ref={firstFocusableRef}
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <form action={action} className="space-y-6">
            <input type="hidden" name="landId" value={landId} />

            {/* Error alert from server action */}
            {state?.success === false && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {state.error}
              </div>
            )}

            {/* Success alert */}
            {state?.success === true && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Classification updated successfully
              </div>
            )}

            {/* Classification Selector */}
            <div>
              <label htmlFor="classificationId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Classification
              </label>
              <select
                id="classificationId"
                name="classificationId"
                defaultValue=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">-- Select a classification --</option>
                {classifications.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
