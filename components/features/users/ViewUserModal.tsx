"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Phone, Calendar, User as UserIcon, Shield } from "lucide-react";
import { getUserById } from "@/app/actions/users";
import { UserDetails, UserTypeEnum } from "@/types/user";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface ViewUserModalProps {
  userId: string;
  locale: string;
  isFullPage?: boolean;
  onClose?: () => void;
}

export default function ViewUserModal({ 
  userId, 
  locale, 
  isFullPage = false,
  onClose 
}: ViewUserModalProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        if (e.key === "Escape") {
          handleClose();
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isFullPage]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const result = await getUserById(parseInt(userId));
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        setError(!result.success ? (result.error ?? "Failed to load user details") : "Failed to load user details");
      }
    } catch {
      setError("An error occurred while loading user details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Render full page view
  if (isFullPage) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Details</h2>
        {isLoading && <LoadingSpinner />}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {user && (
          <div className="space-y-6">
            <UserDetailsContent user={user} />
          </div>
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
            User Details
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {user && (
            <div className="space-y-6">
              <UserDetailsContent user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserDetailsContent({ user }: { user: UserDetails }) {
  return (
    <>
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {user.userType === UserTypeEnum.Internal ? "Internal User" : "External User"}
        </span>
      </div>

      {/* User Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <UserIcon className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-base font-medium text-gray-900">{user.fullName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-base font-medium text-gray-900">{user.email}</p>
          </div>
        </div>

        {user.phoneNumber && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-base font-medium text-gray-900">{user.phoneNumber}</p>
            </div>
          </div>
        )}

        {user.nationalId && (
          <div className="flex items-start gap-3">
            <UserIcon className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">National ID</p>
              <p className="text-base font-medium text-gray-900">{user.nationalId}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Joined Date</p>
            <p className="text-base font-medium text-gray-900">
              {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {user.dateOfBirth && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(user.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Roles */}
      {user.roles && user.roles.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Roles</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Permissions */}
      {user.permissions && user.permissions.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((permission, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
