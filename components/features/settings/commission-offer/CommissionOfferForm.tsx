"use client";

import { useState, useEffect } from "react";
import { CommissionOfferSettings } from "@/types/settings";

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
  const [formData, setFormData] = useState<CommissionOfferSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when settings prop changes
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isNaN(formData.globalCommissionRate) || formData.globalCommissionRate < 0 || formData.globalCommissionRate > 100) {
      newErrors.globalCommissionRate = 'Global commission rate must be between 0 and 100';
    }

    if (isNaN(formData.minOfferPercent) || formData.minOfferPercent < 0 || formData.minOfferPercent > 100) {
      newErrors.minOfferPercent = 'Minimum offer percentage must be between 0 and 100';
    }

    if (isNaN(formData.maxOfferPercent) || formData.maxOfferPercent < 0 || formData.maxOfferPercent > 100) {
      newErrors.maxOfferPercent = 'Maximum offer percentage must be between 0 and 100';
    }

    if (formData.minOfferPercent > formData.maxOfferPercent) {
      newErrors.minOfferPercent = 'Minimum offer must be less than maximum offer';
      newErrors.maxOfferPercent = 'Maximum offer must be greater than minimum offer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAll = async () => {
    if (!validateForm()) {
      return;
    }
    await onSaveAll(formData);
  };

  const handleUpdateGlobalCommission = async () => {
    if (isNaN(formData.globalCommissionRate) || formData.globalCommissionRate < 0 || formData.globalCommissionRate > 100) {
      setErrors({ ...errors, globalCommissionRate: 'Global commission rate must be between 0 and 100' });
      return;
    }
    setErrors({ ...errors, globalCommissionRate: '' });
    await onUpdateGlobalCommission(formData.globalCommissionRate);
  };

  const handleUpdateMinOffer = async () => {
    if (isNaN(formData.minOfferPercent) || formData.minOfferPercent < 0 || formData.minOfferPercent > 100) {
      setErrors({ ...errors, minOfferPercent: 'Minimum offer percentage must be between 0 and 100' });
      return;
    }
    if (formData.minOfferPercent > formData.maxOfferPercent) {
      setErrors({ ...errors, minOfferPercent: 'Minimum offer must be less than maximum offer' });
      return;
    }
    setErrors({ ...errors, minOfferPercent: '' });
    await onUpdateMinOffer(formData.minOfferPercent);
  };

  const handleUpdateMaxOffer = async () => {
    if (isNaN(formData.maxOfferPercent) || formData.maxOfferPercent < 0 || formData.maxOfferPercent > 100) {
      setErrors({ ...errors, maxOfferPercent: 'Maximum offer percentage must be between 0 and 100' });
      return;
    }
    if (formData.minOfferPercent > formData.maxOfferPercent) {
      setErrors({ ...errors, maxOfferPercent: 'Maximum offer must be greater than minimum offer' });
      return;
    }
    setErrors({ ...errors, maxOfferPercent: '' });
    await onUpdateMaxOffer(formData.maxOfferPercent);
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
              value={formData.globalCommissionRate}
              onChange={(e) => setFormData({ ...formData, globalCommissionRate: parseFloat(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.globalCommissionRate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0-100"
              min="0"
              max="100"
              step="0.01"
              disabled={isSaving}
            />
            {errors.globalCommissionRate && (
              <p className="mt-1 text-sm text-red-500">{errors.globalCommissionRate}</p>
            )}
          </div>
          <button
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
              value={formData.minOfferPercent}
              onChange={(e) => setFormData({ ...formData, minOfferPercent: parseFloat(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.minOfferPercent ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0-100"
              min="0"
              max="100"
              step="0.01"
              disabled={isSaving}
            />
            {errors.minOfferPercent && (
              <p className="mt-1 text-sm text-red-500">{errors.minOfferPercent}</p>
            )}
          </div>
          <button
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
              value={formData.maxOfferPercent}
              onChange={(e) => setFormData({ ...formData, maxOfferPercent: parseFloat(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.maxOfferPercent ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0-100"
              min="0"
              max="100"
              step="0.01"
              disabled={isSaving}
            />
            {errors.maxOfferPercent && (
              <p className="mt-1 text-sm text-red-500">{errors.maxOfferPercent}</p>
            )}
          </div>
          <button
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
          onClick={handleSaveAll}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
