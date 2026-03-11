"use client";

import { useState, useEffect } from "react";
import { Classification, getClassifications, updateLandClassification } from "@/lib/api/classifications";

interface ClassificationFormProps {
  landId: string;
  isModal?: boolean;
  onSuccess?: (message: string) => void;
  onCancel?: () => void;
}

export default function ClassificationForm({
  landId,
  isModal = true,
  onSuccess,
  onCancel,
}: ClassificationFormProps) {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [selectedClassificationId, setSelectedClassificationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedClassificationId) {
      setValidationError("Please select a classification");
      return;
    }

    // Validate landId can be parsed to a number
    const parsedLandId = parseInt(landId);
    if (isNaN(parsedLandId)) {
      setError("Invalid listing ID. Please refresh and try again.");
      return;
    }

    setValidationError(null);
    setIsSaving(true);
    setError(null);

    try {
      const successMessage = await updateLandClassification({
        landId: parsedLandId,
        classificationId: selectedClassificationId,
      });
      
      if (onSuccess) {
        onSuccess(successMessage);
      }
    } catch (err: any) {
      console.error("Error updating classification:", err);
      
      // Handle different error types
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;
        
        switch (status) {
          case 401:
          case 403:
            setError("Your session has expired. Please log in again.");
            // Redirect to login after 2 seconds
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
            break;
          
          case 404:
            setError("The requested listing could not be found.");
            break;
          
          case 400:
          case 422:
            setError(message || "Invalid input. Please check your selection.");
            break;
          
          case 500:
          case 502:
          case 503:
            setError("Something went wrong. Please try again later.");
            break;
          
          default:
            setError(message || "Failed to update classification. Please try again.");
        }
      } else if (err.request) {
        // Network error
        setError("Unable to connect. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Classification Selector */}
      <div>
        <label htmlFor="classification" className="block text-sm font-medium text-gray-700 mb-2">
          Select Classification
        </label>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
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
            value={selectedClassificationId || ""}
            onChange={(e) => {
              setSelectedClassificationId(e.target.value ? parseInt(e.target.value) : null);
              setValidationError(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isSaving}
          >
            <option value="">-- Select a classification --</option>
            {classifications.map((classification) => (
              <option key={classification.id} value={classification.id}>
                {classification.name}
              </option>
            ))}
          </select>
        )}
        
        {validationError && (
          <p className="mt-2 text-sm text-red-600">{validationError}</p>
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
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving || isLoading || (error !== null && classifications.length === 0)}
          className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
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
