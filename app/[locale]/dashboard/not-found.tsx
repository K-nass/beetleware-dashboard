import NotFoundDisplay from "@/components/shared/NotFoundDisplay";

export default function DashboardNotFound() {
  return (
    <NotFoundDisplay
      title="404 - Dashboard Page Not Found"
      message="The dashboard page you're looking for doesn't exist."
      homeHref="/en/dashboard"
      homeLabel="Go to Dashboard"
      suggestions={[
        "Listings - View and manage property listings",
        "Users - Manage user accounts",
        "Roles - Configure user roles and permissions",
        "Settings - Update application settings",
      ]}
    />
  );
}
