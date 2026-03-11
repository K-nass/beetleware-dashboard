"use client";

import { useState } from "react";
import { api } from "@/lib/api/axios";

interface PriceChangeFormProps {
  landId: string;
  isModal?: boolean;
  onSuccess?: (message: string) => void;
  onCancel?: () => void;
}

interface CreatePriceChangeRequestCommand {
  landId: number;
  suggestedPrice: number;
  reason: string | null;
}

interface ApiResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: T | null;
}

export default function PriceChangeForm({
  landId,
  isModal = true,
  onSuccess,
  onCancel,
}: PriceChangeFormProps) {
  const [suggestedPrice, setSuggestedPrice] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!suggestedPrice.trim()) {
      setValidationError("Please enter a suggested price");
      return;
    }

    const priceNumber = parseFloat(suggestedPrice);
    if (isNaN(priceNumber)) {
      setValidationError("Please enter a valid number");
      return;
    }

    if (priceNumber <= 0) {
      setValidationError("Price must be greater than zero");
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
      const requestBody: CreatePriceChangeRequestCommand = {
        landId: parsedLandId,
        suggestedPrice: priceNumber,
        reason: reason.trim() || null,
      };

      const response = await api.post<ApiResponse<any>>(
        "/land/price-change-request",
        requestBody
      );
      
      if (!response.data.succeeded) {
        throw new Error(response.data.message || "Failed to submit price change request");
      }
      
      if (onSuccess) {
        onSuccess(response.data.message || "Price change request submitted successfully");
      }
    } catch (err: any) {
      console.error("Error submitting price change request:", err);
      
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
            setError(message || "Invalid input. Please check your entries.");
            break;
          
          case 500:
          case 502:
          case 503:
            setError("Something went wrong. Please try again later.");
            break;
          
          default:
            setError(message || "Failed to submit price change request. Please try again.");
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
      {/* Suggested Price Input */}
      <div>
        <label htmlFor="suggestedPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Suggested Price
        </label>
        <input
          id="suggestedPrice"
          type="text"
          value={suggestedPrice}
          onChange={(e) => {
            setSuggestedPrice(e.target.value);
            setValidationError(null);
          }}
          placeholder="Enter price in SAR"
          disabled={isSaving}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {validationError && (
          <p className="mt-2 text-sm text-red-600">{validationError}</p>
        )}
      </div>

      {/* Reason Textarea */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide a reason for the price change"
          rows={4}
          disabled={isSaving}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Error Message */}
      {error && (
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
          disabled={isSaving}
          className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            "Submit Request"
          )}
        </button>
      </div>
    </form>
  );
}
