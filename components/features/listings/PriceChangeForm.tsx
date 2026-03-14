"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { api } from "@/lib/api/axios";
import { priceChangeSchema } from "@/lib/validation/schemas";

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

interface PriceChangeFormValues {
  suggestedPrice: string;
  reason: string;
  landId: string;
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
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<PriceChangeFormValues>({
    initialValues: {
      suggestedPrice: '',
      reason: '',
      landId: landId,
    },
    validationSchema: priceChangeSchema,
    onSubmit: async (values) => {
      setError(null);

      try {
        const requestBody: CreatePriceChangeRequestCommand = {
          landId: parseInt(values.landId),
          suggestedPrice: parseFloat(values.suggestedPrice),
          reason: values.reason.trim() || null,
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

        let errorMessage = "Failed to submit price change request. Please try again.";
        
        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Suggested Price Input */}
      <div>
        <label htmlFor="suggestedPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Suggested Price
        </label>
        <input
          id="suggestedPrice"
          name="suggestedPrice"
          type="text"
          value={formik.values.suggestedPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter price in SAR"
          disabled={formik.isSubmitting}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${formik.touched.suggestedPrice && formik.errors.suggestedPrice
              ? 'border-red-500'
              : 'border-gray-300'
            }`}
        />
        {formik.touched.suggestedPrice && formik.errors.suggestedPrice && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.suggestedPrice}</p>
        )}
      </div>

      {/* Reason Textarea */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formik.values.reason}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Provide a reason for the price change"
          rows={4}
          disabled={formik.isSubmitting}
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
            onClick={onCancel}
            disabled={formik.isSubmitting}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {formik.isSubmitting ? (
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
