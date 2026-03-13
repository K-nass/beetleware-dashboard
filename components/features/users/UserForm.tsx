"use client";

import { useState, useEffect } from "react";
import { UserTypeEnum, UserDetails } from "@/types/user";

interface UserFormProps {
  initialData?: UserDetails | null;
  userType: UserTypeEnum;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  mode: "add" | "edit";
}

export default function UserForm({
  initialData,
  userType,
  onSubmit,
  isSubmitting,
  mode
}: UserFormProps) {
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    fullName: initialData?.fullName || "",
    phoneNumber: initialData?.phoneNumber || "",
    password: "",
    confirmPassword: "",
    role: initialData?.roles?.[0] || "",
    genderId: initialData?.genderId?.toString() || "",
    nationalId: initialData?.nationalId || "",
    dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || "",
        fullName: initialData.fullName || "",
        phoneNumber: initialData.phoneNumber || "",
        password: "",
        confirmPassword: "",
        role: initialData.roles?.[0] || "",
        genderId: initialData.genderId?.toString() || "",
        nationalId: initialData.nationalId || "",
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : "",
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^5\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must start with 5 and be 9 digits total";
    }

    if (mode === "add" && !formData.password) {
      newErrors.password = "Password is required";
    }

    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[a-zA-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain letters";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain numbers";
      } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters and contain letters and numbers";
      }
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (userType === UserTypeEnum.Internal && !formData.role) {
      newErrors.role = "Role is required for internal users";
    }

    if (userType === UserTypeEnum.Internal && !formData.nationalId) {
      newErrors.nationalId = "National ID is required for internal users";
    }

    if (userType === UserTypeEnum.External && !formData.genderId) {
      newErrors.genderId = "Gender is required for external users";
    }

    if (userType === UserTypeEnum.External && !formData.nationalId) {
      newErrors.nationalId = "National ID is required for external users";
    }

    if (userType === UserTypeEnum.External && !formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required for external users";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: any = {
      email: formData.email,
      fullName: formData.fullName,
      phoneNumber: `+966${formData.phoneNumber}`, // Add country code prefix
    };

    if (formData.password) {
      submitData.password = formData.password;
    }

    if (userType === UserTypeEnum.Internal) {
      submitData.role = formData.role;
      submitData.nationalId = formData.nationalId;
    } else {
      submitData.genderId = parseInt(formData.genderId);
      submitData.nationalId = formData.nationalId;
      submitData.dateOfBirth = formData.dateOfBirth;
    }

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
            +966
          </div>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber.replace('+966', '')}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              setFormData(prev => ({ ...prev, phoneNumber: value }));
              if (errors.phoneNumber) {
                setErrors(prev => ({ ...prev, phoneNumber: "" }));
              }
            }}
            placeholder="5XXXXXXXX (9 digits starting with 5)"
            maxLength={9}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Enter 9 digits starting with 5 (e.g., 512345678)
        </p>
        {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
      </div>

      {/* Role (Internal Users Only) */}
      {userType === UserTypeEnum.Internal && (
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
        </div>
      )}

      {/* National ID (Internal Users) */}
      {userType === UserTypeEnum.Internal && (
        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
            National ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nationalId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.nationalId && <p className="mt-1 text-sm text-red-600">{errors.nationalId}</p>}
        </div>
      )}

      {/* Gender (External Users Only) */}
      {userType === UserTypeEnum.External && (
        <div>
          <label htmlFor="genderId" className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="genderId"
            name="genderId"
            value={formData.genderId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.genderId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
          {errors.genderId && <p className="mt-1 text-sm text-red-600">{errors.genderId}</p>}
        </div>
      )}

      {/* National ID (External Users Only) */}
      {userType === UserTypeEnum.External && (
        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
            National ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nationalId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.nationalId && <p className="mt-1 text-sm text-red-600">{errors.nationalId}</p>}
        </div>
      )}

      {/* Date of Birth (External Users Only) */}
      {userType === UserTypeEnum.External && (
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dateOfBirth ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>
      )}

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password {mode === "add" && <span className="text-red-500">*</span>}
          {mode === "edit" && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {!errors.password && (
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters and contain both letters and numbers
          </p>
        )}
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      {formData.password && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {mode === "add" ? "Creating..." : "Updating..."}
            </span>
          ) : (
            mode === "add" ? "Create User" : "Update User"
          )}
        </button>
      </div>
    </form>
  );
}
