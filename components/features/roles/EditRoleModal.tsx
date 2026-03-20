"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { updateRole } from "@/app/actions/roles";
import { RoleDetailsDto, PageWithClaimsDto } from "@/types/role";
import RoleForm from "./RoleForm";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4" />
          Updating...
        </span>
      ) : (
        "Update Role"
      )}
    </button>
  );
}

interface EditRoleModalProps {
  roleId: number;
  role: RoleDetailsDto;
  pagesWithClaims: PageWithClaimsDto[];
}

export default function EditRoleModal({ roleId, role, pagesWithClaims }: EditRoleModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const [state, action, isPending] = useActionState(updateRole, null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending && state?.success !== true) router.back();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isPending, state, router]);

  useEffect(() => {
    if (state?.success === true) {
      setTimeout(() => router.back(), 2000);
    }
  }, [state, router]);

  const handleClose = () => {
    if (!isPending && state?.success !== true) router.back();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {state?.success === true ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Role updated successfully
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                Edit Role
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
                disabled={isPending}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form action={action} className="space-y-6">
                <RoleForm
                  initialData={role}
                  pagesWithClaims={pagesWithClaims}
                  roleId={roleId}
                  error={state?.success === false ? state.error : null}
                />

                <div className="flex justify-end gap-3">
                  <SubmitButton />
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
