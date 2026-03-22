"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle } from "lucide-react";
import { getUserById } from "@/app/actions/users";
import { deleteUser } from "@/app/actions/users";
import { UserDetails } from "@/types/user";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface DeleteUserModalProps {
  userId: number;
}

export default function DeleteUserModal({ userId }: DeleteUserModalProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getUserById(userId).then(res => {
      if (res.success && res.data) setUser(res.data);
      else setLoadError(!res.success ? (res.error ?? "Failed to load user") : "Failed to load user");
    }).catch(() => setLoadError("Failed to load user")).finally(() => setIsLoading(false));

    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) router.back();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleConfirm = () => {
    setActionError(null);
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.back(), 1000);
      } else {
        setActionError(result.error ?? "Failed to delete user");
      }
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPending) router.back();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-800">Delete User</h2>
          </div>
          <button
            onClick={() => router.back()}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isLoading && <LoadingSpinner />}
          {loadError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {loadError}
            </div>
          )}
          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {actionError}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              User deleted successfully.
            </div>
          )}
          {!isLoading && user && (
            <>
              <p className="text-gray-600 mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div><span className="text-sm font-medium text-gray-500">Name:</span><p className="text-gray-900 font-medium">{user.fullName}</p></div>
                <div><span className="text-sm font-medium text-gray-500">Email:</span><p className="text-gray-900">{user.email}</p></div>
                {user.phoneNumber && <div><span className="text-sm font-medium text-gray-500">Phone:</span><p className="text-gray-900">{user.phoneNumber}</p></div>}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Deleting..." : `Delete ${user.fullName}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
