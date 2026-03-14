"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { UserTypeEnum, UserDetails } from "@/types/user";
import { createUserFormSchema } from "@/lib/validation/schemas";

interface UserFormProps {
  initialData?: UserDetails | null;
  userType: UserTypeEnum;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  mode: "add" | "edit";
}

interface UserFormValues {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  genderId: string;
  nationalId: string;
  dateOfBirth: string;
}

export default function UserForm({
  initialData,
  userType,
  onSubmit,
  isSubmitting,
  mode
}: UserFormProps) {
  const formik = useFormik<UserFormValues>({
    initialValues: {
      email: initialData?.email || "",
      fullName: initialData?.fullName || "",
      phoneNumber: initialData?.phoneNumber || "",
      password: "",
      confirmPassword: "",
      role: initialData?.roles?.[0] || "",
      genderId: initialData?.genderId?.toString() || "",
      nationalId: initialData?.nationalId || "",
      dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : "",
    },
    validationSchema: createUserFormSchema(userType, mode),
    enableReinitialize: true,
    onSubmit: (values) => {
      const submitData: any = {
        email: values.email,
        fullName: values.fullName,
        phoneNumber: `+966${values.phoneNumber}`, // Add country code prefix
      };

      if (values.password) {
        submitData.password = values.password;
      }

      if (userType === UserTypeEnum.Internal) {
        submitData.role = values.role;
        submitData.nationalId = values.nationalId;
      } else {
        submitData.genderId = parseInt(values.genderId);
        submitData.nationalId = values.nationalId;
        submitData.dateOfBirth = values.dateOfBirth;
      }

      onSubmit(submitData);
    },
  });

  useEffect(() => {
    if (initialData) {
      formik.setValues({
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

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
        )}
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
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formik.touched.fullName && formik.errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.fullName}</p>
        )}
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
            value={formik.values.phoneNumber.replace('+966', '')}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              formik.setFieldValue('phoneNumber', value);
            }}
            onBlur={formik.handleBlur}
            placeholder="5XXXXXXXX (9 digits starting with 5)"
            maxLength={9}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Enter 9 digits starting with 5 (e.g., 512345678)
        </p>
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.phoneNumber}</p>
        )}
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
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.role && formik.errors.role ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.role}</p>
          )}
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
            value={formik.values.nationalId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.nationalId && formik.errors.nationalId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {formik.touched.nationalId && formik.errors.nationalId && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.nationalId}</p>
          )}
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
            value={formik.values.genderId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.genderId && formik.errors.genderId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
          {formik.touched.genderId && formik.errors.genderId && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.genderId}</p>
          )}
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
            value={formik.values.nationalId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.nationalId && formik.errors.nationalId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {formik.touched.nationalId && formik.errors.nationalId && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.nationalId}</p>
          )}
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
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.dateOfBirth && formik.errors.dateOfBirth ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.dateOfBirth}</p>
          )}
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
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isSubmitting}
        />
        {!formik.touched.password && !formik.errors.password && (
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters and contain both letters and numbers
          </p>
        )}
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      {formik.values.password && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
          )}
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
