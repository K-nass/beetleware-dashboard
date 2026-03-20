"use client";

import { useFormStatus } from "react-dom";
import { UserDetails } from "@/types/user";
import { PhoneField } from "./PhoneField";

interface InternalUserFormProps {
  user: UserDetails;
}

export function InternalUserForm({ user }: InternalUserFormProps) {
  const { pending } = useFormStatus();
  const rawPhone = (user.phoneNumber ?? "").replace(/^\+966/, "");

  return (
    <>
      <input type="hidden" name="id" value={user.id} />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={user.email}
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          defaultValue={user.fullName}
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      <PhoneField defaultDigits={rawPhone} pending={pending} />

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          name="role"
          defaultValue={user.roles?.[0] ?? ""}
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">Select a role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Staff">Staff</option>
        </select>
      </div>

      <div>
        <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
          National ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nationalId"
          name="nationalId"
          defaultValue={user.nationalId ?? ""}
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-gray-500 text-xs">(leave blank to keep current)</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters and contain both letters and numbers
        </p>
      </div>
    </>
  );
}
