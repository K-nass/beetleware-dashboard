"use client";

import { FormField } from "@/components/ui/forms/FormField";
import { FormInput } from "@/components/ui/forms/FormInput";

interface PasswordFieldProps {
  pending?: boolean;
  required?: boolean;
}

export function PasswordField({ pending, required }: PasswordFieldProps) {
  return (
    <FormField
      label="Password"
      htmlFor="password"
      required={required}
      hint={required ? undefined : "Must be at least 8 characters and contain both letters and numbers"}
    >
      {!required && (
        <span className="text-gray-500 text-xs ml-1">(leave blank to keep current)</span>
      )}
      <FormInput
        type="password"
        id="password"
        name="password"
        pending={pending}
        required={required}
      />
      {required && (
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters and contain both letters and numbers
        </p>
      )}
    </FormField>
  );
}
