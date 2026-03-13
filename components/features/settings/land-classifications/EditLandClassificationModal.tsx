"use client";

import { useEffect, useState, useRef } from "react";
import { X, CheckCircle } from "lucide-react";
import { landClassificationsApi } from "@/lib/api/land-classifications";
import { LandClassification, UpdateLandClassificationCommand } from "@/types/settings";

interface EditLandClassificationModalProps {
  classification: LandClassification;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locale: string;
}

export default function EditLandClassificationModal({ 
  classification,
  isOpen, 
  onClose, 
  onSuccess,
  locale 
}: EditLandClassificationModalProps) {
  const [formData, setFormData] = useState<UpdateLandClassificationCommand>({
    id: classification.id,
    nameAr: classification.nameAr,
    nameEn: classification.nameEn,
    discountPercent: classification.discountPercent
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form with classification data when modal opens
      setFormData({
        id: classification.id,
        nameAr: classification.nameAr,
        nameEn: classification.nameEn,
        discountPercent: classification.discountPercent
      });
      setErrors({});
      setError(null);
      setSuccessMessage(null);
      
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !successMessage && !isSubmitting) {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, classification, successMessage, isSubmitting, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = 'Arabic name is required';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'English name is required';
    }

    if (formData.discountPercent < 0 || formData.discountPercent > 100) {
      newErrors.discountPercent = 'Discount must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await landClassificationsApi.update(classification.id, formData);

      if (response.succeeded) {
        setSuccessMessage(response.message || "Land classification updated successfully");
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      } else {
        // Display the actual error message from the API
        setError(response.message || "Failed to update land classification");
      }
    } catch (err: any) {
      // Extract error message from various possible locations in the error response
      const message = 
        err?.response?.data?.message || 
        err?.response?.data?.errors?.[0] ||
        err?.message || 
        "An error occurred while updating land classification";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !successMessage) {
      setError(null);
      setSuccessMessage(null);
      setErrors({});
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !successMessage && !isSubmitting) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Edit Land Classification
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
            disabled={successMessage !== null || isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}
          
          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code (Read-only) */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={classification.code}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">Code cannot be changed</p>
              </div>

              {/* Name (Arabic) */}
              <div>
                <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Arabic) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nameAr ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="تصنيف أ"
                  dir="rtl"
                  disabled={isSubmitting}
                />
                {errors.nameAr && <p className="mt-1 text-sm text-red-500">{errors.nameAr}</p>}
              </div>

              {/* Name (English) */}
              <div>
                <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
                  Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nameEn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Classification A"
                  disabled={isSubmitting}
                />
                {errors.nameEn && <p className="mt-1 text-sm text-red-500">{errors.nameEn}</p>}
              </div>

              {/* Discount Percent */}
              <div>
                <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="discountPercent"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.discountPercent ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  step="0.01"
                  disabled={isSubmitting}
                />
                {errors.discountPercent && <p className="mt-1 text-sm text-red-500">{errors.discountPercent}</p>}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Classification'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
