"use client";

import { useActionState } from "react";
import { CommunicationsSettings } from "@/types/settings";
import { updateCommunicationsSettings } from "@/app/actions/settings";
import CommunicationsForm from "./CommunicationsForm";

export default function CommunicationsTab({
  initialData,
}: {
  initialData: CommunicationsSettings | null;
}) {
  const [state, formAction] = useActionState(updateCommunicationsSettings, null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Communications Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage contact information and business hours
        </p>
      </div>

      {initialData && (
        <CommunicationsForm
          initialData={initialData}
          formAction={formAction}
          state={state}
        />
      )}
    </div>
  );
}
