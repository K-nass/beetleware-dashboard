import type { NextAuthOptions } from "next-auth";
import { credentialsProvider } from "./providers";
import { jwtCallback, sessionCallback } from "./callbacks";

/**
 * NextAuth configuration options
 * Configures JWT strategy, providers, callbacks, and custom pages
 */
export const authOptions: NextAuthOptions = {
  providers: [credentialsProvider],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXTAUTH_SECRET must be set in production environment"
  );
}
