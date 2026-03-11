"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle } from "lucide-react";
import PriceChangeForm from "./PriceChangeForm";

interface PriceChangeModalProps {
  landId: string;
}

export default function PriceChangeModal({ landId }: PriceChangeModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    
    // Focus the first focusable element
    if (firstFocusableRef.current && !successMessage) {
      firstFocusableRef.current.focus();
    }

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
  }, [successMessage]);

  const handleClose = () => {
    router.back();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !successMessage) {
      handleClose();
    }
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    // Auto-close after 2 seconds
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  // Focus trap implementation
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleTabKey as any);
    return () => {
      document.removeEventListener("keydown", handleTabKey as any);
    };
  }, []);

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
        {successMessage ? (
          // Success Message
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                Request Price Change
              </h2>
              <button
                ref={firstFocusableRef}
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <PriceChangeForm
                landId={landId}
                isModal={true}
                onSuccess={handleSuccess}
                onCancel={handleClose}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
