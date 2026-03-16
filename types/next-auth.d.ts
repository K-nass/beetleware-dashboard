import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extended User interface for NextAuth
   * Compatible with existing User type in types/user.ts
   */
  interface User {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    permissions: string[];
    isActive: boolean;
    accessToken: string;
    refreshToken: string;
    tokenExpiration: number;
    isFirstTimeLogin: boolean;
  }

  /**
   * Extended Session interface
   * Note: accessToken is available server-side only for API calls
   * Tokens are NOT exposed to client JavaScript (HTTP-only cookies)
   */
  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      phoneNumber: string;
      role: string;
      permissions: string[];
      isActive: boolean;
    };
    isFirstTimeLogin: boolean;
    accessToken?: string; // Server-side only
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT interface
   * Stores all authentication data including tokens
   */
  interface JWT {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    permissions: string[];
    isActive: boolean;
    accessToken: string;
    refreshToken: string;
    tokenExpiration: number;
    isFirstTimeLogin: boolean;
    error?: string;
  }
}
