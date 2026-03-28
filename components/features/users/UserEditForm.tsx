"use client";

import { ReactNode, useActionState } from "react";
import { ActionResponse } from "@/app/actions/types";
import { FormErrorBanner } from "@/components/ui/forms/FormErrorBanner";
import { SubmitButton } from "@/components/ui/forms/SubmitButton";

interface UserEditFormProps {
  action: (_prev: ActionResponse<void> | null, data: FormData) => Promise<ActionResponse<void>>;
  children: ReactNode;
}

export function UserEditForm({ action, children }: UserEditFormProps) {
  const [state, formAction] = useActionState(action, null);

  return (
    <>
      {state?.success === false && <FormErrorBanner message={state.error ?? "An error occurred"} />}
      <form action={formAction} className="space-y-4">
        {children}
        <div className="flex justify-end pt-4">
          <SubmitButton label="Update User" pendingLabel="Updating..." />
        </div>
      </form>
    </>
  );
}
