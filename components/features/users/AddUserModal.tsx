"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { addInternalUser, addExternalUser } from "@/app/actions/users";

interface AddUserModalProps {
  userType: "internal" | "external";
}

function SubmitButton({ mode }: { mode: "add" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4" />
          Creating...
        </span>
      ) : (
        "Create User"
      )}
    </button>
  );
}

export default function AddUserModal({ userType }: AddUserModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);

  const basePath = pathname.replace(/\/(internal|external)$/, "");

  const [internalState, internalAction] = useActionState(addInternalUser, null);
  const [externalState, externalAction] = useActionState(addExternalUser, null);

  const state = userType === "internal" ? internalState : externalState;
  const formAction = userType === "internal" ? internalAction : externalAction;

  // Auto-close on success after 2 seconds
  useEffect(() => {
    if (state?.success === true) {
      const timer = setTimeout(() => router.back(), 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state?.success !== true) router.back();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [state?.success, router]);

  const handleClose = () => router.back();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && state?.success !== true) handleClose();
  };

  const handleTabSwitch = (type: "internal" | "external") => {
    if (type !== userType) {
      router.replace(`${basePath}/${type}`);
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
        {state?.success === true ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              User created successfully
            </div>
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
              {state?.success === false && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {state.error}
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
                  >
                    <div className="font-medium">External User</div>
                    <div className="text-xs mt-1">Customer, Client</div>
                  </button>
                </div>
              </div>

              <form action={formAction} className="space-y-4">
                <CommonFields />
                {userType === "internal" ? <InternalFields /> : <ExternalFields />}
                <div className="flex justify-end pt-4">
                  <SubmitButton mode="add" />
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PhoneField({ pending }: { pending: boolean }) {
  const [digits, setDigits] = useState("");
  return (
    <div>
      <label htmlFor="phoneDisplay" className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number <span className="text-red-500">*</span>
      </label>
      {/* Hidden input carries the +966-prefixed value that the server action reads */}
      <input type="hidden" name="phoneNumber" value={`+966${digits}`} />
      <div className="flex gap-2">
        <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
          +966
        </div>
        <input
          type="tel"
          id="phoneDisplay"
          value={digits}
          onChange={(e) => setDigits(e.target.value.replace(/\D/g, ""))}
          required
          maxLength={9}
          placeholder="5XXXXXXXX (9 digits starting with 5)"
          disabled={pending}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Enter 9 digits starting with 5 (e.g., 512345678)
      </p>
    </div>
  );
}

function CommonFields() {
  const { pending } = useFormStatus();
  return (
    <>
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
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
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Phone Number — hidden input carries the +966-prefixed value */}
      <PhoneField pending={pending} />

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters and contain both letters and numbers
        </p>
      </div>
    </>
  );
}

function InternalFields() {
  const { pending } = useFormStatus();
  return (
    <div>
      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
        Role <span className="text-red-500">*</span>
      </label>
      <select
        id="role"
        name="role"
        required
        disabled={pending}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="">Select a role</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="Staff">Staff</option>
      </select>
    </div>
  );
}

function ExternalFields() {
  const { pending } = useFormStatus();
  return (
    <>
      {/* Gender */}
      <div>
        <label htmlFor="genderId" className="block text-sm font-medium text-gray-700 mb-1">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          id="genderId"
          name="genderId"
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">Select gender</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
      </div>

      {/* National ID */}
      <div>
        <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
          National ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nationalId"
          name="nationalId"
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          required
          disabled={pending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
    </>
  );
}
