import { CheckCircle } from "lucide-react";
import { CommissionOfferSettings } from "@/types/settings";
import type { ActionResponse } from "@/app/actions/types";
import { UpdateButton, SaveAllButton } from "./CommissionOfferButtons";

interface CommissionOfferFormProps {
  initialData: CommissionOfferSettings;
  globalAction: (formData: FormData) => void;
  globalState: ActionResponse<void> | null;
  minAction: (formData: FormData) => void;
  minState: ActionResponse<void> | null;
  maxAction: (formData: FormData) => void;
  maxState: ActionResponse<void> | null;
  allAction: (formData: FormData) => void;
  allState: ActionResponse<void> | null;
}

export default function CommissionOfferForm({
  initialData,
  globalAction,
  globalState,
  minAction,
  minState,
  maxAction,
  maxState,
  allAction,
  allState,
}: CommissionOfferFormProps) {
  return (
    <div className="space-y-6">
      {/* Global Commission Rate */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {globalState && !globalState.success && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {globalState.error}
          </div>
        )}
        {globalState?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Global commission rate updated
          </div>
        )}
        <form action={globalAction}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="globalCommissionRate" className="block text-sm font-medium text-gray-700 mb-1">
                Global Commission Rate (%)
              </label>
              <input
                type="number"
                id="globalCommissionRate"
                name="globalCommissionRate"
                defaultValue={initialData.globalCommissionRate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0-100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <UpdateButton label="Update" />
          </div>
        </form>
      </div>

      {/* Minimum Offer Percentage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {minState && !minState.success && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {minState.error}
          </div>
        )}
        {minState?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Minimum offer percentage updated
          </div>
        )}
        <form action={minAction}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="minOfferPercent" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Offer Percentage (%)
              </label>
              <input
                type="number"
                id="minOfferPercent"
                name="minOfferPercent"
                defaultValue={initialData.minOfferPercent}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0-100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <UpdateButton label="Update" />
          </div>
        </form>
      </div>

      {/* Maximum Offer Percentage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {maxState && !maxState.success && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {maxState.error}
          </div>
        )}
        {maxState?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Maximum offer percentage updated
          </div>
        )}
        <form action={maxAction}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="maxOfferPercent" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Offer Percentage (%)
              </label>
              <input
                type="number"
                id="maxOfferPercent"
                name="maxOfferPercent"
                defaultValue={initialData.maxOfferPercent}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0-100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <UpdateButton label="Update" />
          </div>
        </form>
      </div>

      {/* Save All */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {allState && !allState.success && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {allState.error}
          </div>
        )}
        {allState?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            All settings saved successfully
          </div>
        )}
        <form action={allAction}>
          <input type="hidden" name="globalCommissionRate" value={initialData.globalCommissionRate} />
          <input type="hidden" name="minOfferPercent" value={initialData.minOfferPercent} />
          <input type="hidden" name="maxOfferPercent" value={initialData.maxOfferPercent} />
          <div className="flex justify-end">
            <SaveAllButton />
          </div>
        </form>
      </div>
    </div>
  );
}
