"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Classification, getClassifications, updateLandClassification } from "@/lib/api/classifications";
import { classificationSchema } from "@/lib/validation/schemas";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface ClassificationFormProps {
  landId: string;
  isModal?: boolean;
  onSuccess?: (message: string) => void;
  onCancel?: () => void;
}

interface ClassificationFormValues {
  selectedClassificationId: number | null;
  landId: string;
}

export default function ClassificationForm({
  landId,
  isModal = true,
  onSuccess,
  onCancel,
}: ClassificationFormProps) {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<ClassificationFormValues>({
    initialValues: {
      selectedClassificationId: null,
      landId: landId,
    },
    validationSchema: classificationSchema,
    onSubmit: async (values) => {
      setError(null);

      try {
        const successMessage = await updateLandClassification({
          landId: parseInt(values.landId),
          classificationId: values.selectedClassificationId!,
        });
        
        if (onSuccess) {
          onSuccess(successMessage);
        }
      } catch (err: any) {
        console.error("Error updating classification:", err);
        
        let errorMessage = "Failed to update classification. Please try again.";
        
        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      }
    },
  });

  useEffect(() => {
    fetchClassifications();
  }, []);

  const fetchClassifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClassifications();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setClassifications(data);
      } else {
        setClassifications([]);
        setError("Invalid data format received from server.");
      }
    } catch (err) {
      setError("Failed to load classifications. Please try again.");
      console.error("Error fetching classifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Classification Selector */}
      <div>
        <label htmlFor="classification" className="block text-sm font-medium text-gray-700 mb-2">
          Select Classification
        </label>
        
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : error && classifications.length === 0 ? (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchClassifications}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <select
            id="classification"
            name="selectedClassificationId"
            value={formik.values.selectedClassificationId || ""}
            onChange={(e) => {
              formik.setFieldValue('selectedClassificationId', e.target.value ? parseInt(e.target.value) : null);
            }}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              formik.touched.selectedClassificationId && formik.errors.selectedClassificationId
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            disabled={formik.isSubmitting}
          >
            <option value="">-- Select a classification --</option>
            {classifications.map((classification) => (
              <option key={classification.id} value={classification.id}>
                {classification.name}
              </option>
            ))}
          </select>
        )}
        
        {formik.touched.selectedClassificationId && formik.errors.selectedClassificationId && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.selectedClassificationId}</p>
        )}
      </div>

      {/* Error Message */}
      {error && classifications.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isModal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={formik.isSubmitting}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={formik.isSubmitting || isLoading || (error !== null && classifications.length === 0)}
          className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {formik.isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}
