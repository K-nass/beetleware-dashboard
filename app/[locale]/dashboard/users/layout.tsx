/**
 * Users Layout
 * 
 * Provides:
 * - Parallel route handling for children and modal slots
 * - Enables intercepting routes for modal functionality
 * 
 * Used by: Users routes that need modal functionality
 * 
 * Note: Inherits ProtectedRoute, Sidebar, Navbar from parent Dashboard Layout
 */
export default function UsersLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
