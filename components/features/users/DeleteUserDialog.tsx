"use client";

import { useRef, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { UserListItem } from "@/types/user";

interface DeleteUserDialogProps {
  isOpen: boolean;
  user: UserListItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteUserDialog({
  isOpen,
  user,
  onClose,
  onConfirm,
  isDeleting
}: DeleteUserDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isDeleting) {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, isDeleting, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-800">
              Delete User
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900 font-medium">{user.fullName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{user.email}</p>
              </div>
              {user.phoneNumber && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-900">{user.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete User"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
