/**
 * Builds the standard HTTP headers for proxying requests to the external backend.
 * @param accessToken - The JWT bearer token from the next-auth session.
 */
export function buildHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}
