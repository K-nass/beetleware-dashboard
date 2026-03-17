"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle } from "lucide-react";
import { faqApi } from "@/lib/api/faq";
import { Faq, UpdateFaqCommand } from "@/types/settings";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface EditFaqModalRouteProps {
  faqId: number;
}

export default function EditFaqModalRoute({ faqId }: EditFaqModalRouteProps) {
  const router = useRouter();
  const [faq, setFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState<UpdateFaqCommand | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    faqApi.getById(faqId).then(res => {
      if (res.succeeded && res.data) {
        setFaq(res.data);
        setFormData({ id: res.data.id, questionEn: res.data.questionEn, questionAr: res.data.questionAr, answerEn: res.data.answerEn, answerAr: res.data.answerAr });
      } else {
        setError(res.message || "Failed to load FAQ");
      }
    }).catch(() => setError("Failed to load FAQ")).finally(() => setIsLoading(false));

    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !successMessage && !isSubmitting) router.back();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await faqApi.update(formData);
      if (response.succeeded) {
        setSuccessMessage(response.message || "FAQ updated successfully");
        setTimeout(() => router.back(), 2000);
      } else {
        setError(response.message || "Failed to update FAQ");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !successMessage && !isSubmitting) router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {successMessage ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4"><CheckCircle className="w-16 h-16 text-green-500" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Edit FAQ</h2>
              <button onClick={() => router.back()} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {isLoading && <LoadingSpinner />}
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
              {!isLoading && formData && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="questionEn" className="block text-sm font-medium text-gray-700 mb-1">Question (English) <span className="text-red-500">*</span></label>
                    <input type="text" id="questionEn" value={formData.questionEn} onChange={e => setFormData({ ...formData, questionEn: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.questionEn ? "border-red-500" : "border-gray-300"}`} disabled={isSubmitting} />
                    {errors.questionEn && <p className="mt-1 text-sm text-red-500">{errors.questionEn}</p>}
                  </div>
                  <div>
                    <label htmlFor="questionAr" className="block text-sm font-medium text-gray-700 mb-1">Question (Arabic) <span className="text-red-500">*</span></label>
                    <input type="text" id="questionAr" value={formData.questionAr} onChange={e => setFormData({ ...formData, questionAr: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.questionAr ? "border-red-500" : "border-gray-300"}`} dir="rtl" disabled={isSubmitting} />
                    {errors.questionAr && <p className="mt-1 text-sm text-red-500">{errors.questionAr}</p>}
                  </div>
                  <div>
                    <label htmlFor="answerEn" className="block text-sm font-medium text-gray-700 mb-1">Answer (English) <span className="text-red-500">*</span></label>
                    <textarea id="answerEn" value={formData.answerEn} onChange={e => setFormData({ ...formData, answerEn: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.answerEn ? "border-red-500" : "border-gray-300"}`} rows={4} disabled={isSubmitting} />
                    {errors.answerEn && <p className="mt-1 text-sm text-red-500">{errors.answerEn}</p>}
                  </div>
                  <div>
                    <label htmlFor="answerAr" className="block text-sm font-medium text-gray-700 mb-1">Answer (Arabic) <span className="text-red-500">*</span></label>
                    <textarea id="answerAr" value={formData.answerAr} onChange={e => setFormData({ ...formData, answerAr: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.answerAr ? "border-red-500" : "border-gray-300"}`} dir="rtl" rows={4} disabled={isSubmitting} />
                    {errors.answerAr && <p className="mt-1 text-sm text-red-500">{errors.answerAr}</p>}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button type="button" onClick={() => router.back()} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">{isSubmitting ? "Updating..." : "Update FAQ"}</button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
