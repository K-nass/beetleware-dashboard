import { SessionProvider } from '@/lib/auth/SessionProvider';
import './globals.css';

/**
 * Root Layout
 * 
 * Provides:
 * - SessionProvider for NextAuth authentication state
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
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}