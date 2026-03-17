import type { NextAuthOptions } from "next-auth";
import { credentialsProvider } from "./providers";
import { jwtCallback, sessionCallback } from "./callbacks";

export const authOptions: NextAuthOptions = {
  providers: [credentialsProvider],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET must be set in production environment");
}
