import { AuthProvider } from '@/lib/contexts/AuthContext';
import './globals.css';

/**
 * Root Layout
 * 
 * Provides:
 * - AuthProvider for global authentication state
 * - HTML and body structure
 * - Base styling: bg-gray-50, min-h-screen
 * 
 * Used by: All routes in the application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}