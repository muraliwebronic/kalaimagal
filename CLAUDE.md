# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

> **Sources of truth (read order):**
> 1. [task.md](task.md) — locked architecture decisions, phase-by-phase implementation plan
> 2. This file — architecture, conventions, folder layout, implementation rules
> 3. [PROJECT_DOCS.md](PROJECT_DOCS.md) — original product spec. The schema and storage sections in PROJECT_DOCS.md are **superseded** by task.md (production-grade Prisma schema + Cloudflare R2). Feature requirements (paywall, anti-piracy, watermarks) remain authoritative.

> If task.md and PROJECT_DOCS.md disagree, **task.md wins** — it reflects later decisions.

---

## Project Overview

**Kalaimagal** (கலைமகள்) is a Tamil-first content-subscription platform for e-books (PDFs) and blog articles. Free tier + ₹99/month premium subscription via Razorpay. UI is Tamil-primary with English subtitle (editorial publication aesthetic).

---

## Architecture (Locked — see task.md §Architecture Decision)

**Single Next.js 15 app**, no PHP, no dual-domain split.

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript, `src/` dir, import alias `@/*`) |
| ORM | Prisma |
| DB (dev) | MySQL via XAMPP — db `etamil`, user `root`, no password |
| DB (prod) | Hostinger MySQL |
| Auth | JWT (`jose`) + `bcryptjs`; refresh tokens via `Session` table |
| Styling | Tailwind v4 + shadcn/ui (editorial theme) |
| Fonts | `Noto_Sans_Tamil` (body) + `Lora` or `Crimson_Pro` (English display) |
| PDF → WebP | `pdf-poppler` + `sharp` (replaces PHP/Imagick) |
| Storage (dev) | Local FS at `./storage/pdfs/` and `./storage/cache/` |
| Storage (prod) | Cloudflare R2 (S3-compatible) via `@aws-sdk/client-s3` |
| Payments | Razorpay Orders API (test mode in v1) — **no** Subscriptions API |
| Email | Nodemailer + SMTP (provider TBD) |
| Hosting (prod) | Vercel free tier |
| Domain | Single domain; admin at `/admin/*` (no subdomain split) |

### Storage Abstraction

`lib/storage.ts` exposes a single interface (`put`, `get`, `exists`, `stream`, `delete`). Driver selected via `STORAGE_DRIVER=local|r2`. Phase 1 ships the `local` driver only; the R2 driver lands before Phase 5 prod deploy. The convert API is driver-agnostic.

### Authentication

- `lib/auth.ts` — JWT sign/verify with `jose`, password hash/verify with `bcryptjs`
- 15-minute access token, 30-day refresh token (rotated, stored hashed in `Session` table)
- Role enum: `USER | EDITOR | ADMIN | SUPER_ADMIN`
- Admin uses the same User model + role check — **no** separate hardcoded admin from older PROJECT_DOCS.md spec. The seed creates a SUPER_ADMIN from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` with `forcePasswordChangeOnNextLogin=true`.
- Email verify is **soft** — users can browse free content, but must verify before subscribing.

### Paywall / Page Limiting

All PDF page requests go through `app/api/convert/route.ts`:

1. Validate Origin/Referer (CORS check)
2. Validate JWT (Authorization header or `?token=` query)
3. Look up user → check active row in `Subscription` table (not the legacy `users.subscription_status` enum from PROJECT_DOCS.md)
4. Non-subscribers: HTTP 403 if `page > 2`
5. Watermark: "PREVIEW" for non-subscribers, user phone/email diagonal for subscribers (applied via `sharp.composite`)
6. Cache: `storage.exists('cache/{doc_id}/page_{N}.webp')` → stream it. Else convert, cache, stream.
7. HTTP cache headers: `Cache-Control: public, max-age=31536000, immutable` (pages are content-addressed)

### Payment Flow (Manual 30-Day Renewal)

- Use Razorpay **Orders API** — no Subscriptions API, no recurring plans
- Webhook handler at `app/api/payment/webhook/route.ts`:
  1. Validate HMAC SHA256 signature
  2. Dedup via unique `WebhookLog(source, eventId)` — return 200 without re-processing if duplicate
  3. Update `Payment` row, create/extend `Subscription` row (status=ACTIVE, expiresAt = NOW() + 30d)
- Welcome email triggered on capture
- Daily cron at `/api/cron/expiry-check` (3-day reminder + expiry notice), requires `CRON_SECRET` header

---

## Expected Folder Structure

```
src/
├── app/
│   ├── (public)/                # public marketing + content pages
│   │   ├── page.tsx             # homepage
│   │   ├── books/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── legal/{privacy,terms,refunds}/page.tsx
│   ├── (auth)/                  # login, register, verify, reset
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── account/                 # authenticated user area
│   │   ├── page.tsx
│   │   ├── security/page.tsx
│   │   └── subscription/page.tsx
│   ├── admin/                   # admin dashboard (role-gated)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   ├── content/...
│   │   ├── authors/...
│   │   ├── categories/...
│   │   ├── subscribers/...
│   │   ├── plans/...
│   │   ├── coupons/...
│   │   ├── reviews/...
│   │   ├── comments/...
│   │   ├── newsletter/...
│   │   ├── webhooks/...
│   │   ├── audit/...
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/{register,login,logout,logout-all,me,verify-email,forgot-password,reset-password}/route.ts
│   │   ├── content/{list,[id]}/route.ts
│   │   ├── convert/route.ts             # PDF page → WebP (core)
│   │   ├── payment/{create-order,verify,webhook}/route.ts
│   │   ├── admin/{auth,upload,...}/route.ts
│   │   ├── cron/expiry-check/route.ts
│   │   └── health/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                      # shadcn primitives + BiLabel
│   ├── layout/{Header,Footer,MobileNav}.tsx
│   ├── viewer/{PdfReader,CanvasViewer,MobileImgViewer,PreviewBlur,SubscriptionPanel}.tsx
│   └── payment/RazorpayButton.tsx
├── lib/
│   ├── auth.ts                  # JWT + bcrypt + cookie + role guards
│   ├── db.ts                    # Prisma singleton (globalThis pattern)
│   ├── storage.ts               # local | r2 driver abstraction
│   ├── razorpay.ts              # SDK + HMAC helpers
│   ├── email.ts                 # Nodemailer transport + template registry
│   ├── rate-limit.ts            # token bucket (memory dev, Redis-ready)
│   ├── logger.ts                # pino w/ redaction + request IDs
│   └── strings.ts               # { key: { ta, en } } central dictionary
├── middleware.ts                # JWT check + role gate for /account, /admin
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
storage/                         # local-only, gitignored
├── pdfs/
└── cache/
public/
└── brand/                       # logos, OG images
```

---

## Key Implementation Rules

### Required From Day One

1. **Production-grade Prisma schema from Phase 1.2** — see task.md §1.2 for the full model list (~25 models including User/Session/Author/Content/Subscription/Payment/Coupon/AuditLog/etc). Do not start with a minimal 3-table schema and migrate up later.

2. **All configurable values live in `Setting` model OR `.env`** — nothing hardcoded. Site name, tagline, accent color, support email, social links, hero config, plan pricing display value, etc.

3. **Storage abstraction first.** Never call `fs.*` or AWS SDK directly from API routes. Always go through `lib/storage.ts`.

4. **WebP caching is mandatory.** Every converted page is cached to `cache/{doc_id}/page_{N}.webp`. Never re-convert on a cache hit.

5. **Cover image auto-generation.** PDF upload triggers automatic generation of `cache/{uuid}/page_1.webp`. `coverImageUrl` stores the convert API URL (`/api/convert?doc_id={uuid}&page=1`).

6. **Webhook deduplication.** `WebhookLog` has a unique compound (source, eventId). Always check before processing business logic.

7. **Page limit enforcement** — non-subscribers: HTTP 403 if `page > 2`. Check via `Subscription` table (status ACTIVE + expiresAt > now).

8. **CORS + JWT double validation on `/api/convert`** — Origin/Referer must match `NEXT_PUBLIC_APP_URL`; JWT must be valid; both checks before any byte is served.

9. **Bilingual label pattern.** Every chrome label uses `<BiLabel ta="..." en="..." />`. Strings live in `lib/strings.ts`, not inline. Don't hardcode user-facing text in components.

10. **Audit trail.** Every admin mutation writes to `AuditLog` with before/after diff.

11. **Manual 30-day renewal model.** Razorpay Orders API only. On capture, create/extend `Subscription` row with `expiresAt = NOW() + 30d`. Do not implement Subscriptions API, plans, or `subscription.charged` events.

### Security Baseline (wire in as you build — not a Phase 4 afterthought)

- CSP headers in `next.config.js` — script-src self + razorpay; frame-src razorpay
- CSRF: double-submit cookie pattern + Origin check on every mutation
- Rate limits: login 5/min, register 3/hr/IP, password reset 3/hr/email, convert 60/min/user
- Zod validation on every API route — never trust client
- File upload: magic-byte check (not just MIME), UUID-rename, size cap, store outside `public/`
- TipTap output → `isomorphic-dompurify` before store AND on render
- Password policy: min 8 chars + zxcvbn strength check
- Cookies: httpOnly + secure + sameSite=lax
- `NEXT_PUBLIC_*` for public-safe values only — never secrets
- `npm audit` clean before each release

### Anti-Piracy (for subscribed PDF viewers)

- Desktop (≥768px): Canvas-based renderer — pages drawn from fetched WebP
- Mobile (<768px): `<img>` in locked container with `user-select:none; pointer-events:none`
- Right-click disabled; Ctrl+C/P/S blocked
- Server-side watermark (sharp composite): "PREVIEW" diagonal for non-subscribers, user phone/email for subscribers
- PDFs never served as static URLs — only via `/api/convert`

---

## Brand (Locked)

- **Site name:** Kalaimagal (கலைமகள்)
- **Tagline TA:** தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு
- **Tagline EN:** The digital home of Tamil literature
- **Accent (primary):** burgundy `#7A1F2B`
- **Accent (highlight):** saffron `#D97F2E`
- **Background:** warm off-white `#FAF7F2`
- **Primary text:** deep ink `#1A1A1A`
- **Muted:** warm gray `#6B6B6B`
- **Border:** subtle warm `#E8E2D5`
- **Logo:** typographic "கலைமகள்" in display serif until a file is supplied at `/public/brand/`

All of the above are mirrored in `Setting` rows so admins can override at runtime.

---

## Development Setup

### Prerequisites
- Node.js 18+ (currently 22.x)
- MySQL via XAMPP — db `etamil` running locally
- `poppler-utils` on host for PDF→WebP (Phase 2.2+):
  - Windows: `choco install poppler`
  - Vercel: bundle via `@sparticuz/poppler` or layer
- `npm` (currently 11.x)

### Environment

Two env files:
- **`.env.local`** (gitignored) — real secrets + dev config
- **`.env.example`** (committed) — placeholders only

See task.md §1.1 for the full env var list. Key principles:
- All Razorpay test keys in `.env.local` only
- `STORAGE_DRIVER=local` for dev, `r2` for prod
- `CRON_SECRET` and `JWT_SECRET` generated via `openssl rand -base64 32`
- SMTP creds blank until provider is picked

### Commands

```bash
npm install               # install deps
npm run dev               # localhost:3000
npm run build             # production build
npm start                 # production server
npm run lint
npm run type-check        # if added to package.json

npx prisma migrate dev    # create + apply migration in dev
npx prisma db seed        # run prisma/seed.ts
npx prisma studio         # DB GUI on localhost:5555
```

---

## Subscription Plan (v1)

Single plan: **Monthly ₹99 / 30 days**. Stored in `SubscriptionPlan` table (slug=`monthly`, isActive=true, isFeatured=true) and **also** mirrored in `Setting` (`payment.current_price_inr`) for display purposes. No quarterly/annual in v1.

---

## Out of Scope for v1

- Razorpay Subscriptions API / recurring plans
- Full-text search (UI search icon is a placeholder)
- Reading progress UI (data model exists, surfaced later)
- Multiple admin accounts via UI (seed creates one SUPER_ADMIN; create more via Prisma Studio if needed)
- Open/click email tracking (Nodemailer doesn't provide it natively)

---

## How To Work Through The Plan

1. **One phase at a time.** Phase 2 doesn't begin until Phase 1 acceptance criteria pass.
2. **Invoke skills at the listed phases** (`/ui-ux-pro-max` for design, `/seo-technical` for SEO, `/security-review` before launch, `/simplify` before commits — see task.md §Skills to Invoke).
3. **Commit at the end of each numbered subsection** with a descriptive message.
4. **Update task.md** when scope changes — mark `[x]` when done, add notes inline.
5. **Surface doubts early.** Ask the user before making architectural decisions not already locked.
