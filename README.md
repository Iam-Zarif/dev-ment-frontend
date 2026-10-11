# Dev-ment — Developer Assessment Platform

The **Next.js frontend** for Dev-ment, a role-based platform for building technical assessments, managing applications, conducting timed tests, and reviewing candidate performance.

**[Live application](https://dev-ment-frontend.vercel.app)** · **[Backend repository](https://github.com/Iam-Zarif/dev-ment)** · **[Live API](https://dev-ment.vercel.app)**

## Features

| Role | Available workflows |
| --- | --- |
| **Recruiter** | Create and publish assessments, manage a question bank, review applications, shortlist and invite candidates, evaluate submissions, release results, and purchase assessment credits. |
| **Candidate** | Browse published assessments, apply with professional links, manage invitations, take timed assessments with answer saving and integrity checks, and view released results. |
| **Admin** | Review platform metrics, manage users, and view reporting and payment activity. |

Additional capabilities include role-aware dashboards, paginated lists and filters, responsive layouts, form validation, loading and error states, and Stripe Checkout return screens.

## Technology

| Area | Stack |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI, Lucide |
| Data fetching | Axios, TanStack Query |
| Forms | React Hook Form, Zod |
| Client state | Zustand |
| Visualizations | Recharts |
| Quality | Biome, ESLint, TypeScript |

## Run locally

**Requirements:** Node.js 24 (recommended), npm, and a running [Dev-ment backend](https://github.com/Iam-Zarif/dev-ment) with its own database and Redis configuration.

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create `.env.local` in the project root:

   ```dotenv
   NEXT_PUBLIC_API_URL=/api/v1
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BACKEND_API_URL=http://localhost:5001/api/v1
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Open **http://localhost:3000**.

The frontend rewrites `/api/v1/*` to `BACKEND_API_URL` (see `next.config.ts`). Keep `NEXT_PUBLIC_API_URL=/api/v1` for same-origin API requests and cookie handling.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `BACKEND_API_URL` | Server-only backend API base URL, including `/api/v1`; used by the Next.js rewrite and route protection. |
| `NEXT_PUBLIC_API_URL` | Browser API prefix; normally `/api/v1`. |
| `NEXT_PUBLIC_APP_URL` | Canonical frontend application URL. |
| `NEXT_PUBLIC_DEMO_*_EMAIL`, `NEXT_PUBLIC_DEMO_*_PASSWORD` | Optional credentials for the one-click demo buttons (ADMIN, RECRUITER, CANDIDATE). |

**Security:** `NEXT_PUBLIC_*` variables are included in the browser bundle. Use only dedicated public demo accounts for the demo variables. Never place JWT secrets, production credentials, or private service keys in the frontend. JWT verification and refresh-session validation happen in the backend.

## Application structure

```text
src/
├── app/              # App Router: public, auth, dashboard and payment routes
├── components/       # Shared UI, layouts, feedback and skeletons
├── config/           # Navigation, roles and site configuration
├── hooks/            # Reusable React hooks
├── lib/              # API clients, env validation and shared utilities
├── modules/          # Feature-focused components, hooks, schemas and services
│   ├── admin/        # Administration and reporting
│   ├── application/  # Candidate applications and recruiter decisions
│   ├── assessment/   # Assessment creation, publishing and discovery
│   ├── attempt/      # Timed assessment runner and answer submission
│   ├── auth/         # Authentication and account recovery
│   ├── dashboard/    # Role dashboards
│   ├── evaluation/   # Recruiter reviews and candidate results
│   ├── invitation/   # Candidate invitation handling
│   ├── payment/      # Pricing, checkout and billing
│   ├── profile/      # Candidate and recruiter profiles
│   └── question/     # Question bank
├── providers/        # Query, theme and application providers
├── store/            # Zustand state
├── types/            # Shared TypeScript types
└── proxy.ts          # Backend-verified route and role protection
```

## Authentication and payments

- Protected routes for `/admin`, `/recruiter`, and `/candidate` are checked in `src/proxy.ts` against the backend `/auth/session` endpoint.
- Browser requests use access tokens, while a backend-issued HTTP-only refresh cookie supports session renewal. JWT signing and verification stay on the server.
- Recruiter plan purchases use backend-created Stripe Checkout sessions. After Stripe returns to `/payment/success`, the frontend checks the backend payment status before displaying a confirmation; credit grants depend on the backend webhook.

## Available scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Run the local development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve a production build. |
| `npm run lint` | Run Biome lint and ESLint. |
| `npm run typecheck` | Run TypeScript checks. |
| `npm run biome:check` | Run non-writing Biome, ESLint and TypeScript checks. |
| `npm run biome` | Apply Biome fixes, then run ESLint, TypeScript and the Next.js build. |
| `npm run biome:ci` | Run non-writing Biome CI checks, ESLint, TypeScript and the build. |

## Deployment

The frontend is deployed on **Vercel**. Set `BACKEND_API_URL`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_APP_URL` for the target environment. The backend must be independently deployed and configured for PostgreSQL, Redis, authentication, and Stripe.

For checkout returns, configure the backend `FRONTEND_URL` (or explicit `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL`) to use the frontend domain. Stripe webhook delivery and payment confirmation are handled by the backend.

---

**Repository scope:** This repository contains the frontend only. Backend API implementation, persistence, background processing, and payment webhooks are maintained in [Iam-Zarif/dev-ment](https://github.com/Iam-Zarif/dev-ment).
