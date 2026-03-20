"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { updateInternalUser, updateExternalUser } from "@/app/actions/users";
import { UserDetails, UserTypeEnum } from "@/types/user";
import { SubmitButton } from "@/components/ui/forms/SubmitButton";
import { InternalUserForm } from "./InternalUserForm";
import { ExternalUserForm } from "./ExternalUserForm";

interface EditUserModalProps {
  user: UserDetails;
  isFullPage?: boolean;
  onClose?: () => void;
}

export default function EditUserModal({
  user,
  isFullPage = false,
  onClose,
}: EditUserModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const isInternal = user.userType === UserTypeEnum.Internal;

  const [internalState, internalAction] = useActionState(updateInternalUser, null);
  const [externalState, externalAction] = useActionState(updateExternalUser, null);

  const state = isInternal ? internalState : externalState;
  const formAction = isInternal ? internalAction : externalAction;

  useEffect(() => {
    if (!isFullPage) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isFullPage]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const formContent = (
    <>
      {state?.success === false && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        {isInternal ? <InternalUserForm user={user} /> : <ExternalUserForm user={user} />}
        <div className="flex justify-end pt-4">
          <SubmitButton label="Update User" pendingLabel="Updating..." />
        </div>
      </form>
    </>
  );

  if (isFullPage) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>
        {formContent}
      </div>
    );
  }

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Edit User
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
          {formContent}
        </div>
      </div>
    </div>
  );
}
