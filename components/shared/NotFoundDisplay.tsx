import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

interface NotFoundDisplayProps {
  title: string;
  message: string;
  homeHref: string;
  homeLabel?: string;
  suggestions?: string[];
}

export default function NotFoundDisplay({
  title,
  message,
  homeHref,
  homeLabel = "Go Home",
  suggestions,
}: NotFoundDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <FileQuestion className="w-12 h-12 text-blue-600" style={{ color: "#3e69df" }} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="mb-8 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-3">You might want to visit:</p>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" style={{ backgroundColor: "#3e69df" }}></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={homeHref}
          className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#3e69df" }}
        >
          <Home className="w-5 h-5" />
          {homeLabel}
        </Link>
      </div>
    </div>
  );
}
