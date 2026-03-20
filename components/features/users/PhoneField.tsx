"use client";

import { useState } from "react";

interface PhoneFieldProps {
  defaultDigits: string;
  pending: boolean;
}

export function PhoneField({ defaultDigits, pending }: PhoneFieldProps) {
  const [digits, setDigits] = useState(defaultDigits);
  return (
    <div>
      <label htmlFor="phoneDisplay" className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <input type="hidden" name="phoneNumber" value={`+966${digits}`} />
      <div className="flex gap-2">
        <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
          +966
        </div>
        <input
          type="tel"
          id="phoneDisplay"
          value={digits}
          onChange={(e) => setDigits(e.target.value.replace(/\D/g, ""))}
          required
          maxLength={9}
          placeholder="5XXXXXXXX (9 digits starting with 5)"
          disabled={pending}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Enter 9 digits starting with 5 (e.g., 512345678)
      </p>
    </div>
  );
}
