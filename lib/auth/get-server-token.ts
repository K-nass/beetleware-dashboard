import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

/**
 * Get the access token from the server-side session
 * 
 * This function retrieves the access token for making authenticated API requests
 * from Server Components, Server Actions, or API routes.
 * 
 * IMPORTANT: This function is SERVER-SIDE ONLY. Tokens are stored in HTTP-only
 * cookies and are never exposed to client JavaScript for security.
 * 
 * @returns The access token string, or null if no valid session exists
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * import { getServerAccessToken } from "@/lib/auth/get-server-token";
 * 
 * export default async function MyServerComponent() {
 *   const token = await getServerAccessToken();
 *   
 *   if (!token) {
 *     redirect("/login");
 *   }
 *   
 *   const response = await fetch(`${API_URL}/data`, {
 *     headers: {
 *       Authorization: `Bearer ${token}`,
 *     },
 *   });
 *   
 *   // ... rest of component
 * }
 * ```
 */
export async function getServerAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    return null;
  }

  return session.accessToken;
}
