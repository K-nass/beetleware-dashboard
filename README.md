# Dashboard — Admin Panel

A production-ready admin dashboard built with Next.js 15, featuring role-based access control, multilingual support (Arabic/English), and a clean component architecture.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running Without Docker](#running-without-docker)
- [Running With Docker](#running-with-docker)
- [API Flow](#api-flow)
- [Authentication Flow](#authentication-flow)
- [Server & Backend Communication](#server--backend-communication)
- [Build & Production](#build--production)
- [Common Issues & Fixes](#common-issues--fixes)
- [Quick Start](#quick-start)

---

## Project Overview

This is an admin dashboard that communicates with a backend REST API. It handles:

- User authentication via phone number + password
- Role and permission management
- Listings management with classification and price-change workflows
- Application settings (classifications, FAQs, commission offers)
- Full RTL/LTR support with Arabic and English translations

Built for internal admin use — not a public-facing app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth v4 (JWT strategy) |
| i18n | next-intl + i18nexus |
| Forms | Formik + Yup |
| HTTP Client | fetch() |
| Charts | Recharts |
| Drag & Drop | @dnd-kit/react |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
.
├── app/                        # Next.js App Router
│   ├── [locale]/               # All routes are locale-scoped (/en or /ar)
│   │   ├── (login)/            # Login page (route group, no layout)
│   │   └── dashboard/          # Protected dashboard routes
│   │       ├── listings/       # Listings management
│   │       ├── roles/          # Role management
│   │       └── settings/       # App settings
│   ├── actions/                # Server Actions (form submissions, mutations)
│   └── api/
│       └── auth/               # NextAuth API route handler
│
├── components/
│   ├── features/               # Feature-specific components (auth, listings, roles...)
│   ├── shared/                 # Reusable across features (DeleteDialog, ErrorDisplay...)
│   ├── ui/                     # Generic UI primitives (forms, layout, navigation)
│   └── locale/                 # Language switcher component
│
├── lib/
│   ├── api/                    # Server-side API fetch functions
│   ├── auth/                   # NextAuth config, providers, callbacks, token utils
│   ├── utils/                  # Helper functions
│   └── validation/             # Yup validation schemas
│
├── i18n/                       # next-intl routing and request config
├── messages/                   # Translation files (en.json, ar.json)
├── types/                      # TypeScript type definitions
├── proxy.ts                    # Middleware: auth guards + locale routing
├── next.config.ts              # Next.js config (standalone output, image domains)
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Container orchestration
└── .env.example                # Environment variable template
```

**Why this structure?**
- `app/actions/` keeps all data mutations in one place as Server Actions — no separate API routes needed for writes
- `lib/api/` handles all server-side data fetching — keeps pages clean
- `components/features/` groups UI by domain so each feature is self-contained
- `[locale]` wrapping means every route automatically supports both languages

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `I18NEXUS_API_KEY` | Yes | API key for pulling translations from i18nexus |
| `NEXT_PUBLIC_API_URL` | Yes | Backend REST API base URL (e.g. `http://your-server/api/admin`) |
| `NEXTAUTH_SECRET` | Yes | Random string for JWT encryption — min 32 chars |
| `NEXTAUTH_URL` | Yes | Full URL of this app (e.g. `http://localhost:3000`) |

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

> `NEXT_PUBLIC_*` variables are embedded into the client-side bundle at build time. They must be set before running `npm run build` or `docker compose up --build`.

---

## Running Without Docker

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Steps

**1. Clone the repository**
```bash
git clone <repo-url>
cd dashboard
```

**2. Install dependencies**
```bash
npm install --legacy-peer-deps
# or with pnpm
pnpm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
# Edit .env and fill in your actual values
```

**4. Start the development server**
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> The `dev` script pulls the latest translations from i18nexus and starts the Next.js dev server with Turbopack.

---

## Running With Docker

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose)

### Steps

**1. Clone the repository**
```bash
git clone <repo-url>
cd dashboard
```

**2. Set up environment variables**
```bash
cp .env.example .env
# Edit .env and fill in your actual values
```

**3. Build and start the container**
```bash
docker compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### What happens internally

Docker runs a 3-stage build:

1. **deps** — installs Node.js dependencies using `npm ci` (fast, deterministic)
2. **builder** — pulls translations from i18nexus, then runs `next build` to compile the app
3. **runner** — copies only the compiled output (no source code, no devDependencies) into a minimal Alpine image and starts the server

The final image is lean (~200MB vs ~1GB+ without optimization) and runs as a non-root user for security.

### Useful commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop the container
docker compose down

# Rebuild after code changes
docker compose up --build --force-recreate
```

---

## API Flow

All data in this app flows through the backend REST API:

```
User Action (UI)
    ↓
Server Action (app/actions/) or Server Component (lib/api/)
    ↓
HTTP Request with Bearer token → Backend API (NEXT_PUBLIC_API_URL)
    ↓
JSON Response
    ↓
Page re-renders with new data
```

**Where API logic lives:**
- `lib/api/` — server-side fetch functions used in Server Components (read operations)
- `app/actions/` — Server Actions used for mutations (create, update, delete)
- `lib/auth/get-server-token.ts` — utility that retrieves the access token server-side for authenticated requests

**Example — fetching data in a Server Component:**
```typescript
import { getServerAccessToken } from "@/lib/auth/get-server-token";

const token = await getServerAccessToken();
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
```

**Example — mutating data via Server Action:**
```typescript
// app/actions/listings.ts
"use server";
const token = await getServerAccessToken();
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

---

## Authentication Flow

This app uses **NextAuth v4** with a JWT strategy and credentials-based login (phone number + password).

```
1. User submits login form (phone + password)
        ↓
2. NextAuth calls the backend: POST /api/admin/auth/login
        ↓
3. Backend returns: { token, refreshToken, user, isFirstTimeLogin }
        ↓
4. NextAuth stores the token in an HTTP-only cookie (never exposed to JS)
        ↓
5. On every request, middleware (proxy.ts) checks the cookie
        ↓
6. If valid → allow access to /dashboard
   If missing → redirect to login page
        ↓
7. Access token expires after 1 hour → automatically refreshed using refreshToken
   Session cookie expires after 30 days
```

**Key security details:**
- Tokens live in HTTP-only cookies — JavaScript cannot read them (XSS protection)
- In production, cookies are `Secure` (HTTPS only)
- `NEXTAUTH_SECRET` encrypts the JWT — must be set in production

---

## Server & Backend Communication

This app is a **frontend-only** Next.js application. It has no database. All data comes from an external backend API.

**How communication works:**

| Context | How it works |
|---|---|
| Server Components | Direct `fetch()` calls with Bearer token |
| Server Actions | `fetch()` calls with Bearer token |
| Client Components | No direct API calls — data is passed as props from server |

**Middleware (`proxy.ts`)** runs on every request before the page loads. It:
- Checks if the user has a valid session token
- Redirects unauthenticated users to the login page
- Redirects authenticated users away from the login page
- Applies locale routing (`/en/...` or `/ar/...`)

**Next.js API Routes** are only used for NextAuth's internal handler (`app/api/auth/[...nextauth]`). All other API communication goes directly from server-side code to the backend.

---

## Build & Production

**Build the app:**
```bash
npm run build
```
This runs `i18nexus pull` (fetches latest translations) then `next build`.

**Start in production:**
```bash
npm run start
```
This runs `i18nexus pull` then `next start`.

**With Docker (recommended for production):**
```bash
docker compose up --build -d
```

The app is configured with `output: 'standalone'` in `next.config.ts`, which generates a self-contained `server.js` — no `node_modules` needed at runtime. This is what makes the Docker image small and portable.

---

## Common Issues & Fixes

**Missing `.env` file**
```
Error: NEXTAUTH_SECRET must be set in production environment
```
Fix: Copy `.env.example` to `.env` and fill in all values.

---

**Port 3000 already in use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
Fix: Kill the process using port 3000:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
# Or change the port in docker-compose.yml: "3001:3000"
```

---

**Docker build fails — missing env vars**
```
Error: I18NEXUS_API_KEY is not set
```
Fix: Make sure your `.env` file exists and has all required values before running `docker compose up --build`. Docker Compose reads `.env` automatically.

---

**`NEXT_PUBLIC_API_URL` is undefined at runtime**
This variable is baked into the client bundle at build time. If you change it after building, you must rebuild:
```bash
docker compose up --build --force-recreate
```

---

**Translations not loading**
```
Error: i18nexus pull failed
```
Fix: Check that `I18NEXUS_API_KEY` in your `.env` is valid and you have internet access during build.

---

**Docker image won't start — `server.js` not found**
Fix: Make sure `next.config.ts` has `output: 'standalone'`. Without it, the standalone server file is not generated.

---

## Quick Start

For anyone cloning this project and wanting to run it immediately:

```bash
# 1. Clone
git clone <repo-url>
cd dashboard

# 2. Set up environment
cp .env.example .env
# Open .env and fill in: I18NEXUS_API_KEY, NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 3a. Run with Docker (no Node.js install needed)
docker compose up --build

# 3b. OR run locally
npm install --legacy-peer-deps
npm run dev

# 4. Open the app
# http://localhost:3000
```
