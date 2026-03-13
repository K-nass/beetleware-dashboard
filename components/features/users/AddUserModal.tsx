"use client";

import { useState, useRef, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { usersApi } from "@/lib/api/users";
import { UserTypeEnum } from "@/types/user";
import UserForm from "./UserForm";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  locale: string;
}

export default function AddUserModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  locale 
}: AddUserModalProps) {
  const [userType, setUserType] = useState<UserTypeEnum>(UserTypeEnum.Internal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !successMessage) {
          handleClose();
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, successMessage]);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let response;
      if (userType === UserTypeEnum.Internal) {
        response = await usersApi.addInternalUser(formData);
      } else {
        response = await usersApi.addExternalUser(formData);
      }

      if (response.succeeded) {
        handleSuccess("User created successfully");
      } else {
        setError(response.message || "Failed to create user");
      }
    } catch (err: any) {
      // Extract error message from backend response
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "An error occurred while creating user";
      setError(errorMessage);
      console.error('Error creating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    
    if (onSuccess) {
      onSuccess();
    }
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setSuccessMessage(null);
    setError(null);
    setUserType(UserTypeEnum.Internal);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !successMessage) {
      handleClose();
    }
  };

  if (!isOpen) return null;

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
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Add New User
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
            disabled={successMessage !== null}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}
          
          {!successMessage && (
            <>
              {/* User Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType(UserTypeEnum.Internal)}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                      userType === UserTypeEnum.Internal
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
                    onClick={() => setUserType(UserTypeEnum.External)}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                      userType === UserTypeEnum.External
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

              {/* User Form */}
              <UserForm
                userType={userType}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                mode="add"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
