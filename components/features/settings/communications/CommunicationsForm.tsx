"use client";

import { useState, useEffect } from "react";
import { CommunicationsSettings } from "@/types/settings";

interface CommunicationsFormProps {
  settings: CommunicationsSettings;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (settings: CommunicationsSettings) => Promise<void>;
}

export default function CommunicationsForm({
  settings,
  isLoading,
  isSaving,
  onSave
}: CommunicationsFormProps) {
  const [formData, setFormData] = useState<CommunicationsSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when settings prop changes
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.whatsAppNumber.trim()) {
      newErrors.whatsAppNumber = 'WhatsApp number is required';
    }

    if (!formData.contactUsEmail.trim()) {
      newErrors.contactUsEmail = 'Contact us email is required';
    } else if (!validateEmail(formData.contactUsEmail)) {
      newErrors.contactUsEmail = 'Please enter a valid email address';
    }

    if (!formData.supportEmail.trim()) {
      newErrors.supportEmail = 'Support email is required';
    } else if (!validateEmail(formData.supportEmail)) {
      newErrors.supportEmail = 'Please enter a valid email address';
    }

    if (!formData.businessHours.trim()) {
      newErrors.businessHours = 'Business hours are required';
    }

    if (!formData.timeZone.trim()) {
      newErrors.timeZone = 'Time zone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        {/* WhatsApp Number */}
        <div>
          <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="whatsAppNumber"
            value={formData.whatsAppNumber}
            onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.whatsAppNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+966500000000"
            disabled={isSaving}
          />
          {errors.whatsAppNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.whatsAppNumber}</p>
          )}
        </div>

        {/* Contact Us Email */}
        <div>
          <label htmlFor="contactUsEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Us Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contactUsEmail"
            value={formData.contactUsEmail}
            onChange={(e) => setFormData({ ...formData, contactUsEmail: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contactUsEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contact@example.com"
            disabled={isSaving}
          />
          {errors.contactUsEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.contactUsEmail}</p>
          )}
        </div>

        {/* Support Email */}
        <div>
          <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Support Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="supportEmail"
            value={formData.supportEmail}
            onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.supportEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="support@example.com"
            disabled={isSaving}
          />
          {errors.supportEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.supportEmail}</p>
          )}
        </div>

        {/* Business Hours */}
        <div>
          <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700 mb-1">
            Business Hours <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessHours"
            value={formData.businessHours}
            onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.businessHours ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="9 AM - 5 PM"
            disabled={isSaving}
          />
          {errors.businessHours && (
            <p className="mt-1 text-sm text-red-500">{errors.businessHours}</p>
          )}
        </div>

        {/* Time Zone */}
        <div>
          <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="timeZone"
            value={formData.timeZone}
            onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.timeZone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Asia/Riyadh"
            disabled={isSaving}
          />
          {errors.timeZone && (
            <p className="mt-1 text-sm text-red-500">{errors.timeZone}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </form>
  );
}
