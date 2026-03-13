import NotFoundDisplay from "@/components/shared/NotFoundDisplay";

export default function RootNotFound() {
  return (
    <NotFoundDisplay
      title="404 - Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      homeHref="/"
      homeLabel="Go Home"
    />
  );
}
