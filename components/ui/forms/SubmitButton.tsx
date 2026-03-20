"use client";

import { useFormStatus } from "react-dom";
import { Save, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  pendingLabel?: string;
  label?: string;
}

export function SubmitButton({ pendingLabel = "Saving...", label = "Save Changes" }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {pending ? pendingLabel : label}
    </button>
  );
}
