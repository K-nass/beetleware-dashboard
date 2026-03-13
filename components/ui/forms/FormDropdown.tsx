"use client";

import React from 'react';
import { LookupItem } from '@/lib/api/lookup';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface FormDropdownProps {
  label: string;
  value: number | null | undefined;
  options: LookupItem[];
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  loading = false,
  error,
  required = false,
  className = ""
}: FormDropdownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue && selectedValue !== "") {
      onChange(Number(selectedValue));
    }
  };

  const isDisabled = disabled || loading;
  const hasError = !!error;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <select
          value={value || ""}
          onChange={handleChange}
          disabled={isDisabled}
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${hasError 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300'
            }
            ${isDisabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-gray-900'
            }
            appearance-none
          `}
        >
          <option value="" disabled>
            {loading ? "Loading..." : placeholder}
          </option>
          {Array.isArray(options) && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg 
            className={`w-4 h-4 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <LoadingSpinner size="sm" className="py-0 mr-2" />
          Loading options...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Empty options message */}
      {!loading && (!Array.isArray(options) || options.length === 0) && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          No options available
        </div>
      )}
    </div>
  );
}