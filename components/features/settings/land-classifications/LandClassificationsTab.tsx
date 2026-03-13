"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { LandClassification } from "@/types/settings";
import { landClassificationsApi } from "@/lib/api/land-classifications";
import LandClassificationsTable from "./LandClassificationsTable";
import AddLandClassificationModal from "./AddLandClassificationModal";
import EditLandClassificationModal from "./EditLandClassificationModal";
import DeleteDialog from "@/components/shared/DeleteDialog";

export default function LandClassificationsTab() {
  const pathname = usePathname();
  
  const [classifications, setClassifications] = useState<LandClassification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [classificationToEdit, setClassificationToEdit] = useState<LandClassification | null>(null);
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [classificationToDelete, setClassificationToDelete] = useState<LandClassification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const locale = pathname.split('/')[1] || 'en';

  // Fetch classifications on mount
  useEffect(() => {
    fetchClassifications();
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

  const fetchClassifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await landClassificationsApi.getAll();

      if (response.succeeded && response.data) {
        setClassifications(response.data);
      } else {
        setError(response.message || 'Failed to fetch land classifications');
        setClassifications([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred while fetching land classifications');
      setClassifications([]);
      console.error('Error fetching land classifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (classification: LandClassification) => {
    setClassificationToEdit(classification);
    setShowEditModal(true);
  };

  const handleDelete = (classification: LandClassification) => {
    setClassificationToDelete(classification);
    setShowDeleteDialog(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSuccessMessage('Land classification created successfully');
    fetchClassifications();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setClassificationToEdit(null);
    setSuccessMessage('Land classification updated successfully');
    fetchClassifications();
  };

  const handleDeleteConfirm = async () => {
    if (!classificationToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await landClassificationsApi.delete(classificationToDelete.id);

      if (response.succeeded) {
        setClassifications(prevClassifications =>
          prevClassifications.filter(c => c.id !== classificationToDelete.id)
        );
        setShowDeleteDialog(false);
        setClassificationToDelete(null);
        setSuccessMessage('Land classification deleted successfully');
      } else {
        setError(response.message || 'Failed to delete land classification');
        setShowDeleteDialog(false);
        setClassificationToDelete(null);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'An error occurred while deleting land classification';
      setError(errorMessage);
      console.error('Error deleting land classification:', err);
      setShowDeleteDialog(false);
      setClassificationToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
      setClassificationToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Land Classifications</h2>
          <p className="mt-1 text-sm text-gray-500">Manage land classification types and discount percentages</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Classification
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

      {/* Classifications Table */}
      <LandClassificationsTable
        classifications={classifications}
        isLoading={isLoading}
        locale={locale}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Modal */}
      <AddLandClassificationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        locale={locale}
      />

      {/* Edit Modal */}
      {classificationToEdit && (
        <EditLandClassificationModal
          classification={classificationToEdit}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setClassificationToEdit(null);
          }}
          onSuccess={handleEditSuccess}
          locale={locale}
        />
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        entity={classificationToDelete}
        entityType="Land Classification"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        getEntityDisplay={(classification) => ({
          title: locale === 'ar' ? classification.nameAr : classification.nameEn,
          fields: [
            { label: "Code", value: classification.code },
            { label: "Name (Arabic)", value: classification.nameAr },
            { label: "Name (English)", value: classification.nameEn },
            { label: "Discount", value: `${classification.discountPercent}%` }
          ]
        })}
      />
    </div>
  );
}
