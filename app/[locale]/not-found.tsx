import NotFoundDisplay from "@/components/shared/NotFoundDisplay";

export default function LocaleNotFound() {
  return (
    <NotFoundDisplay
      title="404 - Page Not Found"
      message="The page you're looking for doesn't exist within this locale."
      homeHref="/en/dashboard"
      homeLabel="Go to Dashboard"
    />
  );
}
