"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ErrorDisplay from "@/components/shared/ErrorDisplay";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  const params = useParams();
  const locale = params?.locale as string || "en";

  useEffect(() => {
    // Log error with locale context
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      digest: error.digest,
      route: "locale",
      locale,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    
  }, [error, locale]);

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
      homeHref={`/${locale}`}
      homeLabel="Go Home"
    />
  );
}
