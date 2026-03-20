"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changeListingPrice } from "@/app/actions/listings";
import { Loader2 } from "lucide-react";

interface PriceChangeFormProps {
  landId: string;
  isModal?: boolean;
  onCancel?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Submitting...</span>
        </>
      ) : (
        "Submit Request"
      )}
    </button>
  );
}

export default function PriceChangeForm({
  landId,
  isModal = true,
  onCancel,
}: PriceChangeFormProps) {
  const [state, action] = useActionState(changeListingPrice, null);

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
          Price change request submitted successfully
        </div>
      )}

      {/* Suggested Price Input */}
      <div>
        <label htmlFor="suggestedPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Suggested Price
        </label>
        <input
          id="suggestedPrice"
          name="suggestedPrice"
          type="text"
          placeholder="Enter price in SAR"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      {/* Reason Textarea */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          name="reason"
          placeholder="Provide a reason for the price change"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
        />
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
