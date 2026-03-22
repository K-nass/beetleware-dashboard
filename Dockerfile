# ─────────────────────────────────────────────
# Stage 1: Install dependencies
# We use the official Node Alpine image — small footprint (~5MB base vs ~900MB full)
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

# libc6-compat is needed for some native Node modules on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only package files first — Docker caches this layer.
# If package.json doesn't change, npm install won't re-run on next build. Big time saver.
COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps


# ─────────────────────────────────────────────
# Stage 2: Build the Next.js app
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy installed node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# i18nexus pull runs during build — it needs the API key at build time.
# We pass it as a build argument (not hardcoded — never hardcode secrets).
ARG I18NEXUS_API_KEY
ENV I18NEXUS_API_KEY=$I18NEXUS_API_KEY

# NEXTAUTH vars are needed so Next.js doesn't throw during build
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# NEXT_PUBLIC_* vars are baked into the client bundle at build time — must be present here
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the app (runs: i18nexus pull && next build)
RUN npm run build


# ─────────────────────────────────────────────
# Stage 3: Production runner
# Only copies what's needed to RUN the app — no source code, no devDependencies
# This is what keeps the final image lean
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Run as non-root user — security best practice
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the production output from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership so the non-root user can read the files
RUN chown -R nextjs:nodejs /app

USER nextjs

# The port Next.js listens on
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the app (runs: i18nexus pull && next start via standalone server)
CMD ["node", "server.js"]
