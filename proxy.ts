import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Helper to check if a path belongs to a route group
  const isAuthPage = pathname === "/" || pathname === "/en" || pathname === "/ar";
  const isDashboardPage = pathname.includes("/dashboard");

  // Redirect to dashboard if logged in and trying to access login page
  if (token && isAuthPage) {
    const locale = pathname.split("/")[1] || "en";
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect to login if not logged in and trying to access dashboard
  if (!token && isDashboardPage) {
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)' 
}