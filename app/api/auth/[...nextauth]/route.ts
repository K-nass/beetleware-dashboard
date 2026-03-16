import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

/**
 * NextAuth route handler for App Router
 * Handles all authentication requests at /api/auth/*
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
