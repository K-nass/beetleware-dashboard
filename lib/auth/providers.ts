import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Credentials Provider for NextAuth
 * Authenticates users with phone number and password via backend API
 */
export const credentialsProvider = CredentialsProvider({
  name: "credentials",
  credentials: {
    phoneNumber: {
      label: "Phone Number",
      type: "text",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },
  async authorize(credentials): Promise<User | null> {
    if (!credentials?.phoneNumber || !credentials?.password) {
      console.error("Authentication failed: Missing credentials");
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.succeeded) {
        const phoneNumberMasked = credentials.phoneNumber.replace(
          /(\+\d{3})\d+(\d{4})/,
          "$1****$2",
        );
        console.error(
          `Authentication failed for ${phoneNumberMasked}: ${result.message || "Invalid credentials"} (Credential Error)`,
        );
        return null;
      }

      // Extract data from nested structure
      const { data } = result;

      // Validate required fields
      if (!data?.token || !data?.refreshToken || !data?.user) {
        console.error(
          "Authentication failed: Missing required fields in response",
        );
        return null;
      }

      // Calculate token expiration (1 hour from now)
      const tokenExpiration = Date.now() + 3600 * 1000;

      // Return user object with all required fields
      return {
        id: String(data.user.id),
        email: data.user.email,
        fullName: data.user.fullName,
        phoneNumber: data.user.phoneNumber,
        role: data.user.role,
        permissions: data.user.permissions || [],
        isActive: data.user.isActive,
        accessToken: data.token,
        refreshToken: data.refreshToken,
        tokenExpiration,
        isFirstTimeLogin: data.isFirstTimeLogin,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});
