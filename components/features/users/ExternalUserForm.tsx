"use client";

import { useFormStatus } from "react-dom";
import { UserDetails } from "@/types/user";
import { FormField } from "@/components/ui/forms/FormField";
import { FormInput } from "@/components/ui/forms/FormInput";
import { FormSelect } from "@/components/ui/forms/FormSelect";
import { PhoneField } from "./PhoneField";
import { PasswordField } from "./PasswordField";

const GENDER_OPTIONS = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

interface ExternalUserFormProps {
  user: UserDetails;
}

export function ExternalUserForm({ user }: ExternalUserFormProps) {
  const { pending } = useFormStatus();
  const rawPhone = (user.phoneNumber ?? "").replace(/^\+966/, "");
  const dob = user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "";

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

      <FormField label="Gender" htmlFor="genderId" required>
        <FormSelect
          id="genderId"
          name="genderId"
          defaultValue={user.genderId?.toString() ?? ""}
          required
          pending={pending}
          placeholder="Select gender"
          options={GENDER_OPTIONS}
        />
      </FormField>

      <FormField label="National ID" htmlFor="nationalId" required>
        <FormInput type="text" id="nationalId" name="nationalId" defaultValue={user.nationalId ?? ""} required pending={pending} />
      </FormField>

      <FormField label="Date of Birth" htmlFor="dateOfBirth" required>
        <FormInput type="date" id="dateOfBirth" name="dateOfBirth" defaultValue={dob} required pending={pending} />
      </FormField>

      <PasswordField pending={pending} />
    </>
  );
}
