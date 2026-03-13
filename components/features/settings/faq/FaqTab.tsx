"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Faq } from "@/types/settings";
import { faqApi } from "@/lib/api/faq";
import FaqList from "./FaqList";
import AddFaqModal from "./AddFaqModal";
import EditFaqModal from "./EditFaqModal";
import DeleteDialog from "@/components/shared/DeleteDialog";

export default function FaqTab() {
  const pathname = usePathname();
  
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<Faq | null>(null);
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const locale = pathname.split('/')[1] || 'en';

  // Fetch FAQs on mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchFaqs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await faqApi.getAll();

      if (response.succeeded && response.data) {
        // Sort by displayOrder
        const sortedFaqs = [...response.data].sort((a, b) => a.displayOrder - b.displayOrder);
        setFaqs(sortedFaqs);
      } else {
        setError(response.message || 'Failed to fetch FAQs');
        setFaqs([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred while fetching FAQs');
      setFaqs([]);
      console.error('Error fetching FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (faq: Faq) => {
    setFaqToEdit(faq);
    setShowEditModal(true);
  };

  const handleDelete = (faq: Faq) => {
    setFaqToDelete(faq);
    setShowDeleteDialog(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSuccessMessage('FAQ created successfully');
    fetchFaqs();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setFaqToEdit(null);
    setSuccessMessage('FAQ updated successfully');
    fetchFaqs();
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await faqApi.delete(faqToDelete.id);

      if (response.succeeded) {
        setFaqs(prevFaqs => prevFaqs.filter(f => f.id !== faqToDelete.id));
        setShowDeleteDialog(false);
        setFaqToDelete(null);
        setSuccessMessage('FAQ deleted successfully');
      } else {
        setError(response.message || 'Failed to delete FAQ');
        setShowDeleteDialog(false);
        setFaqToDelete(null);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'An error occurred while deleting FAQ';
      setError(errorMessage);
      console.error('Error deleting FAQ:', err);
      setShowDeleteDialog(false);
      setFaqToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
      setFaqToDelete(null);
    }
  };

  const handleReorder = async (reorderedFaqs: Faq[]) => {
    // Optimistically update the UI
    setFaqs(reorderedFaqs);

    try {
      const items = reorderedFaqs.map((faq, index) => ({
        id: faq.id,
        displayOrder: index + 1
      }));

      const response = await faqApi.reorder({ items });

      if (response.succeeded) {
        setSuccessMessage('FAQs reordered successfully');
      } else {
        setError(response.message || 'Failed to reorder FAQs');
        // Revert on error
        fetchFaqs();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred while reordering FAQs');
      console.error('Error reordering FAQs:', err);
      // Revert on error
      fetchFaqs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">FAQ Management</h2>
          <p className="mt-1 text-sm text-gray-500">Drag and drop to reorder FAQs or use the arrow buttons</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add FAQ
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* FAQ List */}
      <FaqList
        faqs={faqs}
        isLoading={isLoading}
        locale={locale}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      {/* Add Modal */}
      <AddFaqModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        locale={locale}
      />

      {/* Edit Modal */}
      {faqToEdit && (
        <EditFaqModal
          faq={faqToEdit}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setFaqToEdit(null);
          }}
          onSuccess={handleEditSuccess}
          locale={locale}
        />
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        entity={faqToDelete}
        entityType="FAQ"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        getEntityDisplay={(faq) => ({
          title: locale === 'ar' ? faq.questionAr : faq.questionEn,
          fields: [
            { label: "Question (English)", value: faq.questionEn },
            { label: "Question (Arabic)", value: faq.questionAr },
            { label: "Answer (English)", value: faq.answerEn.substring(0, 100) + (faq.answerEn.length > 100 ? '...' : '') },
            { label: "Answer (Arabic)", value: faq.answerAr.substring(0, 100) + (faq.answerAr.length > 100 ? '...' : '') }
          ]
        })}
      />
    </div>
  );
}
