import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  pending?: boolean;
}

export function FormInput({ pending, disabled, ...props }: FormInputProps) {
  return (
    <input
      {...props}
      disabled={pending || disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    />
  );
}
