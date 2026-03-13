"use client";

import { useEffect, useState, useRef } from "react";
import { X, CheckCircle } from "lucide-react";
import { faqApi } from "@/lib/api/faq";
import { AddFaqCommand } from "@/types/settings";

interface AddFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locale: string;
}

export default function AddFaqModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  locale 
}: AddFaqModalProps) {
  const [formData, setFormData] = useState<AddFaqCommand>({
    questionEn: '',
    questionAr: '',
    answerEn: '',
    answerAr: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        questionEn: '',
        questionAr: '',
        answerEn: '',
        answerAr: ''
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
  }, [isOpen, successMessage, isSubmitting, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.questionEn.trim()) {
      newErrors.questionEn = 'English question is required';
    }

    if (!formData.questionAr.trim()) {
      newErrors.questionAr = 'Arabic question is required';
    }

    if (!formData.answerEn.trim()) {
      newErrors.answerEn = 'English answer is required';
    }

    if (!formData.answerAr.trim()) {
      newErrors.answerAr = 'Arabic answer is required';
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

      const response = await faqApi.create(formData);

      if (response.succeeded) {
        setSuccessMessage(response.message || "FAQ created successfully");
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      } else {
        // Display the actual error message from the API
        setError(response.message || "Failed to create FAQ");
      }
    } catch (err: any) {
      // Extract error message from various possible locations in the error response
      const message = 
        err?.response?.data?.message || 
        err?.response?.data?.errors?.[0] ||
        err?.message || 
        "An error occurred while creating FAQ";
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Add FAQ
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
        <div className="p-6 overflow-y-auto flex-1">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question (English) */}
              <div>
                <label htmlFor="questionEn" className="block text-sm font-medium text-gray-700 mb-1">
                  Question (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="questionEn"
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.questionEn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="What is your question?"
                  disabled={isSubmitting}
                />
                {errors.questionEn && <p className="mt-1 text-sm text-red-500">{errors.questionEn}</p>}
              </div>

              {/* Question (Arabic) */}
              <div>
                <label htmlFor="questionAr" className="block text-sm font-medium text-gray-700 mb-1">
                  Question (Arabic) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="questionAr"
                  value={formData.questionAr}
                  onChange={(e) => setFormData({ ...formData, questionAr: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.questionAr ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ما هو سؤالك؟"
                  dir="rtl"
                  disabled={isSubmitting}
                />
                {errors.questionAr && <p className="mt-1 text-sm text-red-500">{errors.questionAr}</p>}
              </div>

              {/* Answer (English) */}
              <div>
                <label htmlFor="answerEn" className="block text-sm font-medium text-gray-700 mb-1">
                  Answer (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="answerEn"
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.answerEn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Provide a detailed answer..."
                  rows={4}
                  disabled={isSubmitting}
                />
                {errors.answerEn && <p className="mt-1 text-sm text-red-500">{errors.answerEn}</p>}
              </div>

              {/* Answer (Arabic) */}
              <div>
                <label htmlFor="answerAr" className="block text-sm font-medium text-gray-700 mb-1">
                  Answer (Arabic) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="answerAr"
                  value={formData.answerAr}
                  onChange={(e) => setFormData({ ...formData, answerAr: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.answerAr ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="قدم إجابة مفصلة..."
                  dir="rtl"
                  rows={4}
                  disabled={isSubmitting}
                />
                {errors.answerAr && <p className="mt-1 text-sm text-red-500">{errors.answerAr}</p>}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
                  {isSubmitting ? 'Creating...' : 'Create FAQ'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
