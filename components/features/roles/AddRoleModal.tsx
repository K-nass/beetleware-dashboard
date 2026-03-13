"use client";

import { useEffect, useState, useRef } from "react";
import { X, CheckCircle } from "lucide-react";
import { rolesApi } from "@/lib/api/roles";
import { PageWithClaimsDto, AddRoleCommand } from "@/types/role";
import RoleForm from "./RoleForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locale: string;
}

export default function AddRoleModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  locale 
}: AddRoleModalProps) {
  const [pagesWithClaims, setPagesWithClaims] = useState<PageWithClaimsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPagesWithClaims();
      
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !successMessage && !isSubmitting) {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, successMessage, isSubmitting, onClose]);

  const fetchPagesWithClaims = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await rolesApi.getPagesWithClaims();
      
      if (response.succeeded && response.data) {
        // Ensure data is an array
        const pages = Array.isArray(response.data) ? response.data : [];
        setPagesWithClaims(pages);
      } else {
        setError(response.message || "Failed to load permissions");
        setPagesWithClaims([]);
      }
    } catch (err: any) {
      console.error('Error fetching pages with claims:', err);
      setError(err?.response?.data?.message || "An error occurred while loading permissions");
      setPagesWithClaims([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: AddRoleCommand) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await rolesApi.addRole(formData);

      if (response.succeeded) {
        setSuccessMessage(response.message || "Role created successfully");
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      } else {
        setError(response.message || "Failed to create role");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "An error occurred while creating role";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !successMessage) {
      setError(null);
      setSuccessMessage(null);
      setPagesWithClaims([]);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !successMessage && !isSubmitting) {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Add New Role
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
            disabled={successMessage !== null || isSubmitting}
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
          
          {!isLoading && !successMessage && (
            <RoleForm
              pagesWithClaims={pagesWithClaims}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              mode="add"
            />
          )}
        </div>
      </div>
    </div>
  );
}
