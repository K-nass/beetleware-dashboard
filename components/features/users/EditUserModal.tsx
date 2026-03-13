"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle } from "lucide-react";
import { usersApi } from "@/lib/api/users";
import { UserDetails, UserTypeEnum } from "@/types/user";
import UserForm from "./UserForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface EditUserModalProps {
  userId: string;
  locale: string;
  isFullPage?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function EditUserModal({ 
  userId, 
  locale, 
  isFullPage = false,
  onClose,
  onSuccess
}: EditUserModalProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (!isFullPage) {
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
  }, [isFullPage, successMessage]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await usersApi.getUserById(parseInt(userId));
      if (response.succeeded && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || "Failed to load user details");
      }
    } catch (err) {
      setError("An error occurred while loading user details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const updateData = {
        id: parseInt(userId),
        ...formData
      };

      let response;
      if (user?.userType === UserTypeEnum.Internal) {
        response = await usersApi.updateInternalUser(updateData);
      } else {
        response = await usersApi.updateExternalUser(updateData);
      }

      if (response.succeeded) {
        handleSuccess("User updated successfully");
      } else {
        setError(response.message || "Failed to update user");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "An error occurred while updating user";
      setError(message);
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
      if (isFullPage) {
        router.push(`/${locale}/dashboard/users`);
      } else {
        router.back();
      }
    }, 2000);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !successMessage) {
      handleClose();
    }
  };

  // Render full page view
  if (isFullPage) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>
        
        {isLoading && <LoadingSpinner />}
        
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
        
        {user && !successMessage && (
          <UserForm
            initialData={user}
            userType={user.userType || UserTypeEnum.External}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            mode="edit"
          />
        )}
      </div>
    );
  }

  // Render modal view
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
            Edit User
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
          {isLoading && <LoadingSpinner />}
          
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
          
          {user && !successMessage && (
            <UserForm
              initialData={user}
              userType={user.userType || UserTypeEnum.External}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              mode="edit"
            />
          )}
        </div>
      </div>
    </div>
  );
}
