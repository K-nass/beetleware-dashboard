"use client";

import { useFormik } from "formik";
import { CommissionOfferSettings } from "@/types/settings";
import { commissionOfferSchema } from "@/lib/validation/schemas";

interface CommissionOfferFormProps {
  settings: CommissionOfferSettings;
  isLoading: boolean;
  isSaving: boolean;
  onSaveAll: (settings: CommissionOfferSettings) => Promise<void>;
  onUpdateGlobalCommission: (rate: number) => Promise<void>;
  onUpdateMinOffer: (percent: number) => Promise<void>;
  onUpdateMaxOffer: (percent: number) => Promise<void>;
}

export default function CommissionOfferForm({
  settings,
  isLoading,
  isSaving,
  onSaveAll,
  onUpdateGlobalCommission,
  onUpdateMinOffer,
  onUpdateMaxOffer
}: CommissionOfferFormProps) {
  const formik = useFormik<CommissionOfferSettings>({
    initialValues: settings,
    validationSchema: commissionOfferSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSaveAll(values);
    },
  });

  const handleUpdateGlobalCommission = async () => {
    // Validate only the globalCommissionRate field
    const fieldError = await formik.validateField("globalCommissionRate");
    if (fieldError) {
      formik.setFieldTouched("globalCommissionRate", true);
      return;
    }
    await onUpdateGlobalCommission(formik.values.globalCommissionRate);
  };

  const handleUpdateMinOffer = async () => {
    // Validate minOfferPercent field
    const fieldError = await formik.validateField("minOfferPercent");
    if (fieldError) {
      formik.setFieldTouched("minOfferPercent", true);
      return;
    }
    await onUpdateMinOffer(formik.values.minOfferPercent);
  };

  const handleUpdateMaxOffer = async () => {
    // Validate maxOfferPercent field
    const fieldError = await formik.validateField("maxOfferPercent");
    if (fieldError) {
      formik.setFieldTouched("maxOfferPercent", true);
      return;
    }
    await onUpdateMaxOffer(formik.values.maxOfferPercent);
  };

  return (
    <div className="space-y-6">
      {/* Global Commission Rate */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="globalCommissionRate" className="block text-sm font-medium text-gray-700 mb-1">
              Global Commission Rate (%)
            </label>
            <input
              type="number"
              id="globalCommissionRate"
              name="globalCommissionRate"
              value={formik.values.globalCommissionRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.globalCommissionRate && formik.errors.globalCommissionRate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0-100"
              min="0"
              max="100"
              step="0.01"
              disabled={isSaving}
            />
            {formik.touched.globalCommissionRate && formik.errors.globalCommissionRate && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.globalCommissionRate}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleUpdateGlobalCommission}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            Update
          </button>
        </div>
      </div>

      {/* Minimum Offer Percentage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="minOfferPercent" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Offer Percentage (%)
            </label>
            <input
              type="number"
              id="minOfferPercent"
              name="minOfferPercent"
              value={formik.values.minOfferPercent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.minOfferPercent && formik.errors.minOfferPercent ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0-100"
              min="0"
              max="100"
              step="0.01"
              disabled={isSaving}
            />
            {formik.touched.minOfferPercent && formik.errors.minOfferPercent && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.minOfferPercent}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleUpdateMinOffer}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            Update
          </button>
        </div>
      </div>

      {/* Maximum Offer Percentage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="maxOfferPercent" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Offer Percentage (%)
            </label>
            <input
              type="number"
              id="maxOfferPercent"
              name="maxOfferPercent"
              value={formik.values.maxOfferPercent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.maxOfferPercent && formik.errors.maxOfferPercent ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0-100"
              min="0"
              max="100"
              step="0.01"
              disabled={isSaving}
            />
            {formik.touched.maxOfferPercent && formik.errors.maxOfferPercent && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.maxOfferPercent}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleUpdateMaxOffer}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            Update
          </button>
        </div>
      </div>

      {/* Save All Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving || formik.isSubmitting}
        >
          {isSaving || formik.isSubmitting ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
