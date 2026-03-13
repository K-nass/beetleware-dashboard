"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ErrorDisplay from "@/components/shared/ErrorDisplay";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  const params = useParams();
  const locale = params?.locale as string || "en";

  useEffect(() => {
    // Log error with dashboard and user context
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      digest: error.digest,
      route: "dashboard",
      locale,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    
    console.error("[Dashboard Error Boundary]", errorLog);
  }, [error, locale]);

  const isDevelopment = process.env.NODE_ENV === "development";
  const errorMessage = isDevelopment
    ? `${error.message}${error.digest ? ` (Digest: ${error.digest})` : ""}`
    : "An unexpected error occurred in the dashboard. Please try again or return to the dashboard home.";

  return (
    <ErrorDisplay
      title="Dashboard Error"
      message={errorMessage}
      showReset={true}
      onReset={reset}
      homeHref={`/${locale}/dashboard`}
      homeLabel="Go to Dashboard"
    />
  );
}
