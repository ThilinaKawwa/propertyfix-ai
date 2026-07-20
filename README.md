# PropertyFix AI

AI maintenance triage + contractor dispatch for UK property agencies, landlords, and property managers.

Tenant reports an issue from their phone → AI asks follow-ups + captures photos → classifies urgency/trade/risk into a clean job ticket → manager reviews and approves dispatch → contractor gets a structured brief and confirms → tenant sees live status → landlord gets a summary.

## Stack
- **Next.js 16** (App Router, React 19, React Compiler, Turbopack)
- **TypeScript** + **Tailwind CSS v4** + **shadcn/ui** (Base UI) + **Framer Motion** (`motion`) + **lucide-react**
- **Supabase** — Postgres + Auth (email/password) + Storage
- **Vercel AI Gateway** — Claude triage via AI SDK v7 (with a heuristic fallback when no key is set)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values (see below)
npm run dev                  # http://localhost:3000
npm run build                # production build / type-check
```

### Environment variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # Supabase publishable (anon) key
AI_GATEWAY_API_KEY=                   # optional — Claude via Vercel AI Gateway; blank = heuristic triage
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Without `AI_GATEWAY_API_KEY` the app still works end-to-end using a built-in rule-based triage
> (keyword → trade/urgency/risk). Add the key to switch to live Claude triage automatically.

## How to test the full flow
1. `/signup` — create an agency account (an agency + profile are provisioned on first dashboard load).
2. **Properties** → add a property → **Copy report link**.
3. **Contractors** → add a contractor (e.g. ABC Plumbing Services, trade *Plumber*).
4. Open the report link (incognito) → run the sink-leak scenario, add a photo → **Submit**.
5. Back in the **dashboard** the ticket appears `Pending approval`, triaged as *Urgent / Plumber / Water damage*.
6. Open the ticket → pick the contractor → **Approve dispatch** → copy the contractor link.
7. Open the contractor link → **Confirm attendance** → ticket becomes `Confirmed`.
8. **Mark resolved** → a landlord summary is generated; the tenant status page reflects each step.

## Architecture notes
- Tables are prefixed `pf_` and isolated by **Row Level Security** (agency-scoped).
- Public pages (tenant report, contractor dispatch, status) never use a service-role key — they go through
  `SECURITY DEFINER` RPCs that validate an unguessable token server-side (`lib/supabase/anon.ts`).
- Authed agency data uses the cookie-based SSR client (`lib/supabase/server.ts`) with RLS.
- `proxy.ts` (Next 16's renamed middleware) refreshes the session and guards `/dashboard`.

## Key folders
- `app/` — routes: marketing `/`, `(auth)`, `dashboard/*`, `report/[token]`, `dispatch/[token]`, `status/[token]`, `api/*`
- `components/site/*` — landing sections · `components/app/*` — dashboard · `components/report`, `components/dispatch`, `components/auth`
- `lib/ai/*` — triage + classification + landlord summary (+ heuristic fallback)
- `lib/actions/*` — server actions · `lib/db/queries.ts` — reads · `lib/supabase/*` — clients + proxy
