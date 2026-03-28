import React from 'react';
import { LookupItem } from '@/lib/api/lookup';
import { ChevronDown } from 'lucide-react';

interface FormDropdownProps {
  label: string;
  name: string;
  options: LookupItem[];
  defaultValue?: number | string | null;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function FormDropdown({
  label,
  name,
  options,
  defaultValue,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  className = ""
}: FormDropdownProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          name={name}
          defaultValue={defaultValue ?? ""}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
            border-gray-300
            ${disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-900'
            }
            appearance-none
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className={`w-4 h-4 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
      </div>
    </div>
  );
}
