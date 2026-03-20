import { CheckCircle } from "lucide-react";
import { CommunicationsSettings } from "@/types/settings";
import type { ActionResponse } from "@/app/actions/types";
import { SubmitButton } from "@/components/ui/forms/SubmitButton";

interface CommunicationsFormProps {
  initialData: CommunicationsSettings;
  formAction: (formData: FormData) => void;
  state: ActionResponse<void> | null;
}

export default function CommunicationsForm({
  initialData,
  formAction,
  state,
}: CommunicationsFormProps) {
  return (
    <form action={formAction} className="bg-white rounded-lg border border-gray-200 p-6">
      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Communications settings updated successfully
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="whatsAppNumber"
            name="whatsAppNumber"
            defaultValue={initialData.whatsAppNumber}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+966500000000"
          />
        </div>

        <div>
          <label htmlFor="contactUsEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Us Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contactUsEmail"
            name="contactUsEmail"
            defaultValue={initialData.contactUsEmail}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Support Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="supportEmail"
            name="supportEmail"
            defaultValue={initialData.supportEmail}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="support@example.com"
          />
        </div>

        <div>
          <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700 mb-1">
            Business Hours <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessHours"
            name="businessHours"
            defaultValue={initialData.businessHours}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9 AM - 5 PM"
          />
        </div>

        <div>
          <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="timeZone"
            name="timeZone"
            defaultValue={initialData.timeZone}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Asia/Riyadh"
          />
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton label="Save Settings" pendingLabel="Saving..." />
        </div>
      </div>
    </form>
  );
}
