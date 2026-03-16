"use client";

import { useState, useEffect } from "react";
import { CommunicationsSettings } from "@/types/settings";
import { communicationsSettingsApi } from "@/lib/api/communications-settings";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import CommunicationsForm from "./CommunicationsForm";

export default function CommunicationsTab({ initialData }: { initialData: CommunicationsSettings | null }) {
  const [settings, setSettings] = useState<CommunicationsSettings | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSave = async (updatedSettings: CommunicationsSettings) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await communicationsSettingsApi.update(updatedSettings);

      if (response.succeeded && response.data) {
        setSettings(response.data);
        setSuccessMessage('Communications settings updated successfully');
      } else {
        setError(response.message || 'Failed to update communications settings');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred while updating communications settings');
      console.error('Error updating communications settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Communications Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage contact information and business hours</p>
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

      {/* Form */}
      {settings && (
        <CommunicationsForm
          settings={settings}
          isLoading={isSaving}
          isSaving={isSaving}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
