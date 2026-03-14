"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { CommunicationsSettings } from "@/types/settings";
import { communicationsSchema } from "@/lib/validation/schemas";

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
  const formik = useFormik<CommunicationsSettings>({
    initialValues: settings,
    validationSchema: communicationsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSave(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        {/* WhatsApp Number */}
        <div>
          <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="whatsAppNumber"
            name="whatsAppNumber"
            value={formik.values.whatsAppNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.whatsAppNumber && formik.errors.whatsAppNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+966500000000"
            disabled={isSaving}
          />
          {formik.touched.whatsAppNumber && formik.errors.whatsAppNumber && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.whatsAppNumber}</p>
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
            name="contactUsEmail"
            value={formik.values.contactUsEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.contactUsEmail && formik.errors.contactUsEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contact@example.com"
            disabled={isSaving}
          />
          {formik.touched.contactUsEmail && formik.errors.contactUsEmail && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.contactUsEmail}</p>
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
            name="supportEmail"
            value={formik.values.supportEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.supportEmail && formik.errors.supportEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="support@example.com"
            disabled={isSaving}
          />
          {formik.touched.supportEmail && formik.errors.supportEmail && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.supportEmail}</p>
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
            name="businessHours"
            value={formik.values.businessHours}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.businessHours && formik.errors.businessHours ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="9 AM - 5 PM"
            disabled={isSaving}
          />
          {formik.touched.businessHours && formik.errors.businessHours && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.businessHours}</p>
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
            name="timeZone"
            value={formik.values.timeZone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.timeZone && formik.errors.timeZone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Asia/Riyadh"
            disabled={isSaving}
          />
          {formik.touched.timeZone && formik.errors.timeZone && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.timeZone}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving || formik.isSubmitting}
          >
            {isSaving || formik.isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </form>
  );
}
