import { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options: SelectOption[];
  pending?: boolean;
}

export function FormSelect({ placeholder, options, pending, disabled, ...props }: FormSelectProps) {
  return (
    <select
      {...props}
      disabled={pending || disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
