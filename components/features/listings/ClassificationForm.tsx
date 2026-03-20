"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { classifyListing } from "@/app/actions/listings";
import { Loader2 } from "lucide-react";
import type { Classification } from "@/lib/api/classifications";

interface ClassificationFormProps {
  landId: string;
  classifications: Classification[];
  isModal?: boolean;
  onCancel?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Saving...</span>
        </>
      ) : (
        "Save"
      )}
    </button>
  );
}

export default function ClassificationForm({
  landId,
  classifications,
  isModal = true,
  onCancel,
}: ClassificationFormProps) {
  const [state, action] = useActionState(classifyListing, null);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="landId" value={landId} />

      {/* Error / success feedback */}
      {state?.success === false && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}
      {state?.success === true && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Classification updated successfully
        </div>
      )}

      {/* Classification Selector */}
      <div>
        <label htmlFor="classificationId" className="block text-sm font-medium text-gray-700 mb-2">
          Select Classification
        </label>
        <select
          id="classificationId"
          name="classificationId"
          defaultValue=""
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">-- Select a classification --</option>
          {classifications.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isModal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <SubmitButton />
      </div>
    </form>
  );
}
