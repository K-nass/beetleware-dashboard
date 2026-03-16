# NextAuth Migration Guide

This guide helps you migrate from the old direct API authentication to NextAuth.

## What's Been Implemented

✅ NextAuth v4 with JWT strategy
✅ Phone number + password authentication
✅ Automatic token refresh (1-hour expiration)
✅ HTTP-only cookie storage for security
✅ Server-side token access utility
✅ TypeScript type definitions
✅ Environment configuration

## Files Created

```
types/next-auth.d.ts                    # TypeScript type definitions
lib/auth/
  ├── auth-options.ts                   # NextAuth configuration
  ├── providers.ts                      # Credentials provider
  ├── callbacks.ts                      # JWT and session callbacks
  ├── get-server-token.ts               # Server-side token utility
  └── README.md                         # Documentation
app/api/auth/[...nextauth]/route.ts     # NextAuth route handler
.env.example                            # Environment variable template
```

## Migration Steps

### 1. Update Environment Variables

Add to your `.env` file (already done):
```env
NEXTAUTH_SECRET=your_nextauth_secret_here_please_change_in_production
NEXTAUTH_URL=http://localhost:3000
```

**IMPORTANT**: Generate a secure secret for production:
```bash
openssl rand -base64 32
```

### 2. Wrap Your App with SessionProvider

Update `app/layout.tsx` to include the SessionProvider:

```typescript
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### 3. Update Login Page

Replace the old login logic with NextAuth:

**Before** (using `lib/auth/login.ts`):
```typescript
import auth from "@/lib/auth/login";

const handleLogin = async () => {
  const response = await auth.login({ phoneNumber, password });
  // Handle response
};
```

**After** (using NextAuth):
```typescript
import { signIn } from "next-auth/react";

const handleLogin = async () => {
  const result = await signIn("credentials", {
    phoneNumber,
    password,
    redirect: false,
  });

  if (result?.error) {
    // Handle error
  } else {
    // Redirect to dashboard
    router.push("/dashboard");
  }
};
```

### 4. Access User Session

**Client Components**:
```typescript
"use client";
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {session.user.fullName}</p>
      <p>Role: {session.user.role}</p>
      {session.isFirstTimeLogin && (
        <p>Please change your password</p>
      )}
    </div>
  );
}
```

**Server Components**:
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

export default async function ServerComponent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <div>Welcome, {session.user.fullName}</div>;
}
```

### 5. Make Authenticated API Calls

**Server-Side** (recommended):
```typescript
import { getServerAccessToken } from "@/lib/auth/get-server-token";

export default async function DataPage() {
  const token = await getServerAccessToken();

  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return <div>{/* render data */}</div>;
}
```

**Client-Side** (via API route):
```typescript
// app/api/data/route.ts
import { getServerAccessToken } from "@/lib/auth/get-server-token";

export async function GET() {
  const token = await getServerAccessToken();

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
```

### 6. Handle Logout

```typescript
import { signOut } from "next-auth/react";

const handleLogout = () => {
  signOut({ callbackUrl: "/login" });
};
```

### 7. Protect Routes with Middleware (Optional)

Create `middleware.ts` in the root:

```typescript
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

## Key Differences

| Old System | NextAuth |
|------------|----------|
| Manual token storage | HTTP-only cookies (automatic) |
| Manual token refresh | Automatic refresh |
| Tokens in localStorage | Tokens never exposed to client |
| Manual session management | Built-in session management |
| Custom auth logic | Standard NextAuth patterns |

## Security Improvements

1. **HTTP-only cookies**: Tokens are never accessible to JavaScript, preventing XSS attacks
2. **Automatic refresh**: Tokens refresh transparently without user intervention
3. **Server-side token access**: API calls from server components keep tokens secure
4. **JWT encryption**: All session data is encrypted with NEXTAUTH_SECRET

## Testing the Implementation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to your login page

3. Enter credentials:
   - Phone number: `+966500000000`
   - Password: Your password

4. Check the session:
   ```typescript
   const { data: session } = useSession();
   console.log(session);
   ```

## Troubleshooting

### "NEXTAUTH_SECRET must be set"
- Add `NEXTAUTH_SECRET` to your `.env` file
- Generate a secure secret: `openssl rand -base64 32`

### "Authentication failed"
- Check that `NEXT_PUBLIC_API_URL` is correct
- Verify the backend API is running
- Check browser console for error messages

### Session is null
- Ensure SessionProvider wraps your app
- Check that cookies are enabled
- Verify NEXTAUTH_URL matches your app URL

### Token not refreshing
- Check that the refresh endpoint `/api/admin/auth/refresh` exists
- Verify the refresh token is valid
- Check server logs for refresh errors

## Next Steps

1. Update all components that use the old auth system
2. Remove the old `lib/auth/login.ts` file (after migration)
3. Test the complete authentication flow
4. Generate a production-ready NEXTAUTH_SECRET
5. Update your deployment environment variables

## Need Help?

- NextAuth Documentation: https://next-auth.js.org/
- Check `lib/auth/README.md` for usage examples
- Review the spec files in `specs/nextauth-implementation/`
