"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ErrorDisplayProps {
  title: string;
  message: string;
  showReset?: boolean;
  onReset?: () => void;
  homeHref: string;
  homeLabel?: string;
  icon?: React.ReactNode;
}

export default function ErrorDisplay({
  title,
  message,
  showReset = true,
  onReset,
  homeHref,
  homeLabel = "Go Home",
  icon,
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {icon || (
            <div className="bg-red-100 rounded-full p-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {showReset && onReset && (
            <button
              onClick={onReset}
              className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#3e69df" }}
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}
          
          <Link
            href={homeHref}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
