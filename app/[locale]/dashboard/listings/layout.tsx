/**
 * Listings Layout
 * 
 * Provides:
 * - Parallel route handling for children and modal slots
 * - Enables intercepting routes for modal functionality
 * 
 * Used by: Listings routes that need modal functionality
 * 
 * Note: Inherits ProtectedRoute, Sidebar, Navbar from parent Dashboard Layout
 */
export default function ListingsLayout({
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
