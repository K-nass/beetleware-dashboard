import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.succeeded) {
      throw new Error(result.message || "Token refresh failed");
    }

    const { data } = result;

    // Update token with new values
    return {
      ...token,
      accessToken: data.token,
      refreshToken: data.refreshToken || token.refreshToken,
      tokenExpiration: Date.now() + 3600 * 1000, // 1 hour from now
    };
  } catch (error) {
    const maskedToken = token.refreshToken
      ? `${token.refreshToken.substring(0, 10)}...`
      : "undefined";
    console.error(
      `Token refresh failed for token ${maskedToken}:`,
      error instanceof Error ? error.message : "Unknown error"
    );

    // Return existing token with error flag
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 * JWT callback - manages token lifecycle
 * Handles initial sign-in and automatic token refresh
 */
export async function jwtCallback({
  token,
  user,
}: {
  token: JWT;
  user?: User;
}): Promise<JWT> {
  // Initial sign-in: populate JWT with user data
  if (user) {
    return {
      ...token,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      tokenExpiration: user.tokenExpiration,
      isFirstTimeLogin: user.isFirstTimeLogin,
    };
  }

  // Token hasn't expired yet
  if (token.tokenExpiration && Date.now() < token.tokenExpiration) {
    return token;
  }

  // Token expired, refresh it
  return await refreshAccessToken(token);
}

/**
 * Session callback - transforms JWT data to session format
 * Note: accessToken is only available server-side
 */
export async function sessionCallback({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}): Promise<Session> {
  // Populate session with user data
  return {
    ...session,
    user: {
      id: token.id,
      email: token.email,
      fullName: token.fullName,
      phoneNumber: token.phoneNumber,
      role: token.role,
      permissions: token.permissions,
      isActive: token.isActive,
    },
    isFirstTimeLogin: token.isFirstTimeLogin,
    accessToken: token.accessToken, // Available server-side only
  };
}
