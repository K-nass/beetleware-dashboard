"use client";

import { useFormStatus } from "react-dom";
import { UserDetails } from "@/types/user";
import { FormField } from "@/components/ui/forms/FormField";
import { FormInput } from "@/components/ui/forms/FormInput";
import { FormSelect } from "@/components/ui/forms/FormSelect";
import { PhoneField } from "./PhoneField";
import { PasswordField } from "./PasswordField";

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Staff", label: "Staff" },
];

interface InternalUserFormProps {
  user: UserDetails;
}

export function InternalUserForm({ user }: InternalUserFormProps) {
  const { pending } = useFormStatus();
  const rawPhone = (user.phoneNumber ?? "").replace(/^\+966/, "");

  return (
    <>
      <input type="hidden" name="id" value={user.id} />

      <FormField label="Email" htmlFor="email" required>
        <FormInput type="email" id="email" name="email" defaultValue={user.email} required pending={pending} />
      </FormField>

      <FormField label="Full Name" htmlFor="fullName" required>
        <FormInput type="text" id="fullName" name="fullName" defaultValue={user.fullName} required pending={pending} />
      </FormField>

      <PhoneField defaultDigits={rawPhone} pending={pending} />

      <FormField label="Role" htmlFor="role" required>
        <FormSelect
          id="role"
          name="role"
          defaultValue={user.roles?.[0] ?? ""}
          required
          pending={pending}
          placeholder="Select a role"
          options={ROLE_OPTIONS}
        />
      </FormField>

      <FormField label="National ID" htmlFor="nationalId" required>
        <FormInput type="text" id="nationalId" name="nationalId" defaultValue={user.nationalId ?? ""} required pending={pending} />
      </FormField>

      <PasswordField pending={pending} />
    </>
  );
}
