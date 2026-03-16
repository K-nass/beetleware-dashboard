# NextAuth Implementation

This directory contains the NextAuth v4 authentication implementation for the application.

## Files

- **auth-options.ts** - NextAuth configuration with JWT strategy
- **providers.ts** - Credentials provider for phone number + password authentication
- **callbacks.ts** - JWT and session callbacks for token management and refresh
- **get-server-token.ts** - Server-side utility to access tokens for API calls

## Usage

### Client-Side Authentication

```typescript
// In a Client Component
"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function LoginForm() {
  const { data: session } = useSession();

  const handleLogin = async (phoneNumber: string, password: string) => {
    const result = await signIn("credentials", {
      phoneNumber,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("Login failed");
    }
  };

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.fullName}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return <form>{/* login form */}</form>;
}
```

### Server-Side API Calls

```typescript
// In a Server Component or Server Action
import { getServerAccessToken } from "@/lib/auth/get-server-token";

export default async function ServerComponent() {
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

### Session Data

The session object contains:
- `user` - User information (id, email, fullName, phoneNumber, role, permissions, isActive)
- `isFirstTimeLogin` - Boolean flag for first-time login

**Security Note**: Access tokens are stored in HTTP-only cookies and are NOT exposed to client JavaScript. Use `getServerAccessToken()` for server-side API calls.

## Token Refresh

Tokens automatically refresh when expired (1-hour expiration). The refresh happens transparently in the JWT callback.

## Environment Variables

Required environment variables:
- `NEXTAUTH_SECRET` - Secret for JWT encryption (minimum 32 characters)
- `NEXTAUTH_URL` - Application URL
- `NEXT_PUBLIC_API_URL` - Backend API base URL

See `.env.example` for details.

## API Endpoints

- **Login**: POST `/api/admin/auth/login`
  - Request: `{ phoneNumber, password }`
  - Response: `{ data: { token, refreshToken, isFirstTimeLogin, user } }`

- **Refresh**: POST `/api/admin/auth/refresh`
  - Request: `{ refreshToken }`
  - Response: `{ data: { token, refreshToken } }`

## Security Features

- HTTP-only cookies prevent XSS attacks
- Automatic token refresh
- JWT encryption with NEXTAUTH_SECRET
- Server-side token access only
- 30-day session expiration
