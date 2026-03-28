"use client";

import { useEffect } from "react";
import ErrorDisplay from "@/components/shared/ErrorDisplay";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error with context
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      digest: error.digest,
      route: "root",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === "development";
  const errorMessage = isDevelopment
    ? `${error.message}${error.digest ? ` (Digest: ${error.digest})` : ""}`
    : "An unexpected error occurred. Please try again or return to the home page.";

  return (
    <ErrorDisplay
      title="Something Went Wrong"
      message={errorMessage}
      showReset={true}
      onReset={reset}
      homeHref="/"
      homeLabel="Go Home"
    />
  );
}
