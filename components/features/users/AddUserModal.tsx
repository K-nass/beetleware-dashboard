"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, CheckCircle } from "lucide-react";
import { usersApi } from "@/lib/api/users";
import { UserTypeEnum } from "@/types/user";
import UserForm from "./UserForm";

interface AddUserModalProps {
  userType: "internal" | "external";
}

export default function AddUserModal({ userType }: AddUserModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // base path: swap the last segment (internal/external)
  const basePath = pathname.replace(/\/(internal|external)$/, "");

  const apiUserType = userType === "internal" ? UserTypeEnum.Internal : UserTypeEnum.External;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !successMessage) router.back();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [successMessage]);

  const handleClose = () => router.back();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !successMessage) handleClose();
  };

  const handleTabSwitch = (type: "internal" | "external") => {
    if (type !== userType) {
      setError(null);
      router.replace(`${basePath}/${type}`);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = userType === "internal"
        ? await usersApi.addInternalUser(formData)
        : await usersApi.addExternalUser(formData);

      if (response.succeeded) {
        setSuccessMessage("User created successfully");
        setTimeout(() => router.back(), 2000);
      } else {
        setError(response.message || "Failed to create user");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "An error occurred while creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {successMessage ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                Add New User
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* User Type Tabs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("internal")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                      userType === "internal"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                    disabled={isSubmitting}
                  >
                    <div className="font-medium">Internal User</div>
                    <div className="text-xs mt-1">Admin, Manager, Staff</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("external")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                      userType === "external"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                    disabled={isSubmitting}
                  >
                    <div className="font-medium">External User</div>
                    <div className="text-xs mt-1">Customer, Client</div>
                  </button>
                </div>
              </div>

              <UserForm
                userType={apiUserType}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                mode="add"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
