"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle } from "lucide-react";
import { landClassificationsApi } from "@/lib/api/land-classifications";
import { LandClassification, UpdateLandClassificationCommand } from "@/types/settings";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface EditLandClassificationModalRouteProps {
  classificationId: number;
}

export default function EditLandClassificationModalRoute({ classificationId }: EditLandClassificationModalRouteProps) {
  const router = useRouter();
  const [classification, setClassification] = useState<LandClassification | null>(null);
  const [formData, setFormData] = useState<UpdateLandClassificationCommand | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    landClassificationsApi.getById(classificationId).then(res => {
      if (res.succeeded && res.data) {
        setClassification(res.data);
        setFormData({ id: res.data.id, nameAr: res.data.nameAr, nameEn: res.data.nameEn, discountPercent: res.data.discountPercent });
      } else {
        setError(res.message || "Failed to load classification");
      }
    }).catch(() => setError("Failed to load classification")).finally(() => setIsLoading(false));

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

  const validate = (): boolean => {
    if (!formData) return false;
    const newErrors: Record<string, string> = {};
    if (!formData.nameAr.trim()) newErrors.nameAr = "Arabic name is required";
    if (!formData.nameEn.trim()) newErrors.nameEn = "English name is required";
    if (formData.discountPercent < 0 || formData.discountPercent > 100) newErrors.discountPercent = "Discount must be between 0 and 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !formData) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await landClassificationsApi.update(classificationId, formData);
      if (response.succeeded) {
        setSuccessMessage(response.message || "Classification updated successfully");
        setTimeout(() => router.back(), 2000);
      } else {
        setError(response.message || "Failed to update classification");
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
      <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {successMessage ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4"><CheckCircle className="w-16 h-16 text-green-500" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Edit Land Classification</h2>
              <button onClick={() => router.back()} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {isLoading && <LoadingSpinner />}
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
              {!isLoading && formData && classification && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <input type="text" value={classification.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" disabled readOnly />
                    <p className="mt-1 text-xs text-gray-500">Code cannot be changed</p>
                  </div>
                  <div>
                    <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic) <span className="text-red-500">*</span></label>
                    <input type="text" id="nameAr" value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nameAr ? "border-red-500" : "border-gray-300"}`} dir="rtl" disabled={isSubmitting} />
                    {errors.nameAr && <p className="mt-1 text-sm text-red-500">{errors.nameAr}</p>}
                  </div>
                  <div>
                    <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">Name (English) <span className="text-red-500">*</span></label>
                    <input type="text" id="nameEn" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nameEn ? "border-red-500" : "border-gray-300"}`} disabled={isSubmitting} />
                    {errors.nameEn && <p className="mt-1 text-sm text-red-500">{errors.nameEn}</p>}
                  </div>
                  <div>
                    <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage <span className="text-red-500">*</span></label>
                    <input type="number" id="discountPercent" value={formData.discountPercent} onChange={e => setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.discountPercent ? "border-red-500" : "border-gray-300"}`} min="0" max="100" step="0.01" disabled={isSubmitting} />
                    {errors.discountPercent && <p className="mt-1 text-sm text-red-500">{errors.discountPercent}</p>}
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => router.back()} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">{isSubmitting ? "Updating..." : "Update Classification"}</button>
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
