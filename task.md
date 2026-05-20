# Kalaimagal (கலைமகள்) — Development Task Plan

> **Source of truth:** [PROJECT_DOCS.md](PROJECT_DOCS.md) for features, schema, business rules.
> **AI agent rules:** [CLAUDE.md](CLAUDE.md) for architecture and conventions.

---

## Architecture Decision (Locked)

| Decision | Choice | Rationale |
|---|---|---|
| Stack | **Single Next.js 15 app** (App Router, TypeScript) | Server cost concern + Prisma requirement |
| Database (dev) | MySQL via XAMPP (db: `etamil`, user: `root`, no password) | Already running locally |
| Database (prod) | MySQL on Hostinger (or PlanetScale free tier) | User's existing Hostinger plan |
| ORM | **Prisma** | User request — clean schema management |
| PDF → WebP | Node-native (`pdf-poppler` + `sharp`) | Replaces PHP/Imagick |
| **PDF storage (dev)** | Local filesystem `./storage/pdfs/` and `./storage/cache/` | XAMPP-friendly |
| **PDF storage (prod)** | **Cloudflare R2** (S3-compatible, zero egress fees) | Locked — cheapest viable + Vercel-compatible |
| **Hosting (prod)** | **Vercel free tier** | Locked |
| **Domain (prod)** | **Single domain**; admin at `/admin/*` | Locked — no api subdomain split |
| **UI language** | **Tamil-primary with English subtitle** (e.g., புத்தகங்கள் / Books) | Locked |
| **Email verify policy** | **Soft** — user can browse free content, but must verify before subscribing | Locked |
| Auth | JWT via `jose` + `bcryptjs` | Standard Next.js pattern |
| Styling | **Tailwind v4 + shadcn/ui** with editorial theme | Editorial publication aesthetic |
| Tamil font | Noto Sans Tamil (`next/font/google`) | Per PROJECT_DOCS §13.8 |
| English headline font | Lora or Crimson Pro (serif) | Editorial feel |
| Payments | Razorpay **test mode** for v1 | Locked |
| Email | **Nodemailer** with SMTP (provider TBD) | Locked — replaces Resend per user request |
| **Site name** | **Kalaimagal** (கலைமகள்) | Locked — also stored in `Setting` table for DB-driven changes |
| **Brand convention** | Site-wide config (name, tagline, logo URL, accent color, social links, support email, pricing) lives in `Setting` model + `.env` defaults | Locked — production-grade configurability |
| **Plan (v1)** | **Monthly ₹99 / 30 days only** | Locked — quarterly/annual deferred |
| **Admin (seed)** | `admin@gmail.com` / `password@123` | Locked — **must be force-changed on first login** |

---

## Open Questions (Defer — Not Blocking Phase 1)

1. **SMTP provider for Nodemailer** — Gmail (free, app password needed), Hostinger SMTP, SendGrid, Mailgun, or other? *Env vars are flexible; you can pick later.*
2. **Logo file** — typographic-only ("கலைமகள்" in display serif/script) is the default. If you have a logo file, drop it in `/public/brand/`.
3. **Tagline** — suggesting "தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு" / "The digital home of Tamil literature". Confirm or change.
4. **Accent color** — suggesting deep burgundy `#7A1F2B` with saffron `#D97F2E` for highlights (warm + literary). Confirm or pick custom.
5. **Cloudflare R2** — will be set up in Phase 5 (prod deploy). Phase 1-4 uses local filesystem only.
6. **Custom domain** — when you have one, swap into `NEXT_PUBLIC_APP_URL` env var.

### Already Resolved ✅
- Architecture: Single Next.js + Prisma + MySQL (`etamil` db, root user)
- Site name: **Kalaimagal** (கலைமகள்)
- Subscription: **Monthly ₹99 / 30 days only** for v1
- Admin seed: `admin@gmail.com` / `password@123` (forced change on first login)
- Razorpay: **test keys provided** (stored in `.env.local`, NEVER committed)
- Email: **Nodemailer** with SMTP (provider TBD)
- Hosting (prod target): Vercel + Cloudflare R2 (deferred) + Hostinger MySQL
- Domain structure: single domain, `/admin` for admin
- UI: Tamil-primary with English subtitle
- Email verify: soft (gates only subscription, not browsing)
- Design style: Editorial / Publication
- First milestone: Foundation (setup + auth + layout)
- Production-grade DB from start (full schema in Phase 1.2)
- All configurable values live in `Setting` model OR `.env` — nothing hardcoded

---

## Skills to Invoke

| Phase | Skill | Purpose |
|---|---|---|
| Layout & design system | `/ui-ux-pro-max` | Editorial style, color palette, font pairing, component design |
| Color palette + tokens | `/ui-ux-pro-max` | Pick 161-palette match for editorial Tamil publication |
| SEO foundations | `/seo-technical` | Sitemap, robots, canonical, meta tags, Core Web Vitals |
| Schema markup | `/seo-schema` | Book, Article, Organization, BreadcrumbList JSON-LD |
| Content/keywords | `/seo-content-keywords` | Tamil content SEO, title patterns |
| International | `/seo-engines-global` | Tamil hreflang, ccTLD strategy if needed |
| Brand voice | `/ckm-brand` | Tamil publication tone, micro-copy |
| Audit before launch | `/seo-audit-tools` | 20-point AI readiness + Google ranking checklist |
| Review changed code | `/simplify` | Before each milestone commit |
| Final review | `/security-review` | Auth, JWT, webhook, file upload paths |

---

## Phase 1 — Foundation (Setup + Auth + Layout)

**Goal:** Project runs locally. User can register, log in, see the editorial homepage shell.

### 1.1 Project Initialization
- [ ] `npx create-next-app@latest .` — TypeScript, App Router, Tailwind, ESLint, `src/` directory, import alias `@/*`
- [ ] Install core deps: `prisma @prisma/client jose bcryptjs zod react-hook-form @hookform/resolvers`
- [ ] Install dev deps: `@types/bcryptjs`
- [ ] Initialize shadcn/ui: `npx shadcn@latest init` with editorial theme tokens
- [ ] Set up `.env.local` (gitignored, real values) and `.env.example` (committed, placeholders only):

  ```env
  # ---- Core ----
  NODE_ENV=development
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  NEXT_PUBLIC_SITE_NAME="Kalaimagal"
  NEXT_PUBLIC_SITE_NAME_TAMIL="கலைமகள்"

  # ---- Database ----
  DATABASE_URL="mysql://root:@localhost:3306/etamil"

  # ---- Auth ----
  JWT_SECRET="<openssl rand -base64 32>"
  JWT_ACCESS_TTL_SECONDS=900            # 15 min access token
  JWT_REFRESH_TTL_SECONDS=2592000       # 30 day refresh token

  # ---- Storage (driver switch) ----
  STORAGE_DRIVER=local                  # local | r2
  STORAGE_LOCAL_PATH=./storage
  # R2 (prod only — leave blank until Phase 5):
  R2_ACCOUNT_ID=
  R2_ACCESS_KEY_ID=
  R2_SECRET_ACCESS_KEY=
  R2_BUCKET_PDFS=kalaimagal-pdfs
  R2_BUCKET_CACHE=kalaimagal-cache
  R2_ENDPOINT=

  # ---- Razorpay (TEST MODE — keys provided by user, NEVER commit .env.local) ----
  RAZORPAY_KEY_ID=rzp_test_SYUQHezAmitAOg
  RAZORPAY_KEY_SECRET=QvF0A0cUSYTx7b3DxSiP1iNg
  NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SYUQHezAmitAOg
  RAZORPAY_WEBHOOK_SECRET=                # generate from Razorpay dashboard when configuring webhook

  # ---- Email (Nodemailer SMTP — fill when SMTP provider chosen) ----
  SMTP_HOST=                              # e.g., smtp.gmail.com or smtp.hostinger.com
  SMTP_PORT=587                           # 465 for SSL, 587 for STARTTLS
  SMTP_SECURE=false                       # true if port=465
  SMTP_USER=
  SMTP_PASS=
  EMAIL_FROM="Kalaimagal <hello@kalaimagal.com>"
  EMAIL_REPLY_TO=support@kalaimagal.com

  # ---- Admin seed (only used by `prisma db seed`) ----
  SEED_ADMIN_EMAIL=admin@gmail.com
  SEED_ADMIN_PASSWORD=password@123
  SEED_ADMIN_NAME="Admin"
  SEED_FORCE_PASSWORD_CHANGE=true         # admin must change on first login

  # ---- Cron ----
  CRON_SECRET="<openssl rand -base64 32>"

  # ---- Observability ----
  SENTRY_DSN=
  LOG_LEVEL=info
  ```

- [ ] **`.env.example` must contain placeholders only** — copy the file but replace every secret value with `<your-value-here>`. Commit only `.env.example`.
- [ ] Verify `.env*` is in `.gitignore` EXCEPT `.env.example` (use `!.env.example` rule).
- [ ] Add `storage/pdfs/` and `storage/cache/` to `.gitignore`
- [ ] Create folder structure per CLAUDE.md "Expected Folder Structure"

### 1.2 Prisma Schema — Production-Grade

> **Design principle:** PROJECT_DOCS.md describes the *minimum*. This schema covers everything a real production publication platform needs: roles, sessions, categories, authors, reading progress, bookmarks, reviews, comments, plans, coupons, invoices, audit logs, notifications, email logs, webhook logs, activity tracking, settings, soft deletes. Future-proofed without over-engineering.

- [ ] `npx prisma init --datasource-provider mysql`
- [ ] Define the **full production schema** in `prisma/schema.prisma`:

#### Core identity & access

| Model | Key fields | Notes |
|---|---|---|
| `User` | id, name, email (unique), phone? (unique), passwordHash, **forcePasswordChangeOnNextLogin** (bool), emailVerifiedAt?, emailVerificationToken?, passwordResetToken?, passwordResetExpiresAt?, role (enum: USER/EDITOR/ADMIN/SUPER_ADMIN), avatarUrl?, bio?, preferredLanguage (TA/EN), notificationPreferences (Json), isActive, isBanned, banReason?, lastLoginAt?, lastActiveAt?, loginCount, referralCode (unique), referredByUserId? (self-FK), termsAcceptedAt?, marketingConsent, deletedAt? (soft delete), createdAt, updatedAt | Replaces hardcoded admin |
| `Session` | id, userId (FK), tokenHash (unique), deviceInfo?, ipAddress?, userAgent?, expiresAt, lastUsedAt, revokedAt?, createdAt | Refresh tokens + device tracking |
| `ApiToken` | id, userId (FK), name, tokenHash (unique), scopes (Json), lastUsedAt?, expiresAt?, revokedAt?, createdAt | For future mobile app |
| `Author` | id, slug (unique), nameTamil, nameEnglish?, bioTamil?, bioEnglish?, photoUrl?, bornYear?, diedYear?, awards (Json), isFeatured, sortOrder, createdAt, updatedAt | Proper author profiles |
| `Category` | id, slug (unique), nameTamil, nameEnglish?, description?, parentId? (self-FK for hierarchy), iconUrl?, sortOrder, isActive, createdAt, updatedAt | Tree structure |
| `Tag` | id, slug (unique), nameTamil, nameEnglish?, useCount, createdAt | |

#### Content

| Model | Key fields | Notes |
|---|---|---|
| `Content` | id, slug (unique), type (PDF/BLOG), titleTamil, titleEnglish?, subtitle?, description?, excerpt?, bodyText? (LongText, blogs only), filePath? (PDFs only), fileSizeBytes?, fileMimeType?, pageCount?, coverImageUrl?, ogImageUrl?, metaTitle?, metaDescription?, isbn?, publicationYear?, publisher?, edition?, language (TA/EN/BILINGUAL), readingTimeMinutes?, wordCount?, viewCount (default 0), uniqueViewCount (default 0), downloadCount (default 0), shareCount (default 0), averageRating? (decimal), reviewCount (default 0), isPremium, isFeatured, status (DRAFT/SCHEDULED/PUBLISHED/ARCHIVED), publishedAt?, scheduledAt?, sortOrder, seriesId? (FK), seriesOrder?, createdById (FK User), updatedById? (FK User), deletedAt?, createdAt, updatedAt | Rename of content_metadata — production-ready |
| `ContentAuthor` | contentId, authorId, role (AUTHOR/TRANSLATOR/EDITOR/ILLUSTRATOR), sortOrder | Many-to-many w/ role |
| `ContentCategory` | contentId, categoryId | Many-to-many |
| `ContentTag` | contentId, tagId | Many-to-many |
| `Series` | id, slug (unique), nameTamil, nameEnglish?, description?, coverImageUrl?, isCompleted, createdAt, updatedAt | Multi-volume books |

#### Reading experience (PROJECT_DOCS §13.12 — added now, used later)

| Model | Key fields | Notes |
|---|---|---|
| `ReadingProgress` | id, userId, contentId, lastPage, totalPages?, percentComplete, completedAt?, lastReadAt, updatedAt — **unique(userId, contentId)** | Resume reading |
| `Bookmark` | id, userId, contentId, pageNumber, note?, createdAt | Saved pages |
| `Highlight` | id, userId, contentId, pageNumber, text, color (YELLOW/GREEN/BLUE/PINK), note?, createdAt | Annotations |
| `Favorite` | id, userId, contentId, createdAt — **unique(userId, contentId)** | Liked content |

#### Community

| Model | Key fields | Notes |
|---|---|---|
| `Review` | id, userId, contentId, rating (1-5), title?, body?, status (PENDING/APPROVED/REJECTED/FLAGGED), helpfulCount, reportedCount, moderatedById?, moderatedAt?, createdAt, updatedAt — **unique(userId, contentId)** | Book/blog reviews |
| `Comment` | id, userId, contentId, parentId? (self-FK for replies), body, status (PENDING/APPROVED/REJECTED/SPAM), likeCount, reportedCount, editedAt?, deletedAt?, createdAt | Blog comments |
| `ReviewVote` | id, reviewId, userId, isHelpful, createdAt — **unique(reviewId, userId)** | Helpful counter |

#### Monetization

| Model | Key fields | Notes |
|---|---|---|
| `SubscriptionPlan` | id, slug (unique), nameTamil, nameEnglish, descriptionTamil?, descriptionEnglish?, priceInr (decimal), durationDays, features (Json), isActive, isFeatured, sortOrder, razorpayPlanId?, createdAt, updatedAt | No more hardcoded ₹99 |
| `Subscription` | id, userId, planId (FK), startedAt, expiresAt, status (ACTIVE/EXPIRED/CANCELLED/PAUSED), cancelledAt?, cancellationReason?, autoRenew, lastPaymentId?, createdAt, updatedAt | Lifecycle separate from Payment |
| `Payment` | id, userId, subscriptionId? (FK), planId? (FK), couponId? (FK), razorpayOrderId?, razorpayPaymentId?, razorpaySignature?, razorpayRefundId?, amount (decimal), discountAmount (default 0), taxAmount (default 0), netAmount, currency (default INR), paymentMethod? (CARD/UPI/NETBANKING/WALLET/EMI), status (CREATED/ATTEMPTED/PAID/FAILED/REFUNDED/PARTIAL_REFUND), failureReason?, refundedAmount?, refundedAt?, invoiceNumber? (unique), receiptUrl?, ipAddress?, paidAt?, createdAt, updatedAt | Full payment record |
| `Coupon` | id, code (unique), type (PERCENTAGE/FIXED), value (decimal), maxUses?, usedCount, perUserLimit, minAmount?, validFrom, validUntil?, appliesTo (Json — plan_ids), isActive, createdById, createdAt, updatedAt | Promotions |
| `CouponUsage` | id, couponId, userId, paymentId, discountApplied, usedAt | Audit trail |
| `Invoice` | id, invoiceNumber (unique), paymentId (FK), userId, billingName, billingEmail, billingPhone?, billingAddress?, gstNumber?, subtotal, gstAmount, totalAmount, currency, issuedAt, pdfUrl?, sentAt?, createdAt | GST-compliant invoicing |

#### Operations & observability

| Model | Key fields | Notes |
|---|---|---|
| `Notification` | id, userId, type (SYSTEM/PAYMENT/CONTENT/SOCIAL), title, body, linkUrl?, readAt?, createdAt | In-app notification center |
| `EmailLog` | id, userId?, toEmail, emailType, subject, templateId?, providerMessageId? (SMTP message-id), status (QUEUED/SENT/FAILED/BOUNCED), errorMessage?, sentAt?, createdAt | Track every transactional send. Nodemailer returns less metadata than Resend — open/click tracking not available without extra infra. |
| `WebhookLog` | id, source (RAZORPAY/etc), eventType, eventId? (provider's id, unique with source), payload (Json), signature?, status (RECEIVED/PROCESSED/FAILED/DUPLICATE), errorMessage?, receivedAt, processedAt? | Razorpay deduplication lives here |
| `AuditLog` | id, userId?, action (CREATE/UPDATE/DELETE/LOGIN/LOGOUT/etc), entityType, entityId?, changes (Json — before/after), ipAddress?, userAgent?, createdAt | Admin & user actions |
| `ActivityLog` | id, userId?, contentId?, eventType (PAGE_VIEW/CONTENT_VIEW/READ_START/READ_COMPLETE/DOWNLOAD/SHARE/SEARCH/CTA_CLICK), metadata (Json), sessionId?, ipAddress?, userAgent?, referrer?, createdAt | Lightweight analytics; index on createdAt + eventType |
| `Setting` | key (unique PK), value (Json), description?, updatedById?, updatedAt | Runtime config |
| `NewsletterSubscriber` | id, email (unique), userId? (FK if logged in), source?, subscribedAt, unsubscribedAt?, unsubscribeToken (unique), createdAt | Newsletter signups |
| `ContactSubmission` | id, name, email, phone?, subject, message, status (NEW/READ/REPLIED/SPAM), assignedToId?, internalNotes?, ipAddress?, createdAt, repliedAt? | Contact form |
| `MediaAsset` | id, uploadedById, originalFilename, storedPath, mimeType, sizeBytes, width?, height?, alt?, usedInCount, createdAt | Images, covers, etc. |

#### Critical indexes & constraints

- [ ] `User`: index on email, phone, role, isActive, lastActiveAt, deletedAt
- [ ] `Session`: index on tokenHash, expiresAt, userId
- [ ] `Content`: index on slug, status, type, isPremium, publishedAt, isFeatured, deletedAt; composite (status, type, publishedAt)
- [ ] `Payment`: index on razorpayPaymentId, razorpayOrderId, userId, status, createdAt
- [ ] `WebhookLog`: **unique compound (source, eventId)** for dedup
- [ ] `Subscription`: index on userId, status, expiresAt — critical for daily cron
- [ ] `ActivityLog`: index on createdAt, eventType, userId — partitionable later
- [ ] `EmailLog`: index on userId, status, sentAt
- [ ] All FKs: explicit `onDelete` behavior (typically `Cascade` for owned data, `Restrict` for referenced)

#### Migration & seeding

- [ ] `npx prisma migrate dev --name init` — generates initial migration
- [ ] `lib/db.ts` — Prisma client singleton with `globalThis` pattern for Next.js HMR
- [ ] `prisma/seed.ts`:
  - 1 SUPER_ADMIN user from env (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`) — bcrypt hashed, `forcePasswordChangeOnNextLogin=true`
  - **1 SubscriptionPlan** (v1): Monthly ₹99 / 30d, slug=`monthly`, isActive=true, isFeatured=true
  - 5 Categories: இலக்கியம் / சிறுகதை / நாவல் / கவிதை / கட்டுரை
  - 2 Tags: ஆரம்பநிலை / மேம்பட்ட
  - 2 Authors with bios
  - 3 sample Contents: 1 free PDF, 1 premium PDF, 1 free blog
  - 1 demo Coupon: code `WELCOME10`, 10% off, expires in 90 days
  - **Settings** (all DB-editable from admin UI later):
    - `site.name` → "Kalaimagal"
    - `site.name_tamil` → "கலைமகள்"
    - `site.tagline_tamil` → "தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு"
    - `site.tagline_english` → "The digital home of Tamil literature"
    - `site.support_email` → "support@kalaimagal.com"
    - `site.logo_url` → null (use typographic logo until uploaded)
    - `site.accent_color` → "#7A1F2B" (deep burgundy)
    - `site.accent_color_alt` → "#D97F2E" (saffron)
    - `site.social_links` → `{ twitter: null, instagram: null, youtube: null, facebook: null }`
    - `site.hero_config` → `{ headline_tamil, headline_english, cta_text_tamil, cta_text_english, featured_content_ids: [] }`
    - `payment.current_price_inr` → 99 (mirrors plan but easily editable for display)
    - `payment.currency` → "INR"
    - `legal.privacy_url`, `legal.terms_url`, `legal.refund_url` → defaults to internal pages
    - `feature.email_verify_required` → false (soft mode)
    - `feature.maintenance_mode` → false
- [ ] Run seed: `npx prisma db seed`
- [ ] Verify in Prisma Studio (`npx prisma studio`)

### 1.3 Design System (`/ui-ux-pro-max`)
- [ ] Invoke `/ui-ux-pro-max` to lock editorial palette + typography:
  - Background: warm off-white (`#FAF7F2` or similar)
  - Primary text: deep ink (`#1A1A1A`)
  - Accent: burgundy or deep saffron (single accent)
  - Muted: warm gray (`#6B6B6B`)
  - Border: subtle warm (`#E8E2D5`)
- [ ] Configure `tailwind.config.ts` with these tokens
- [ ] Set up fonts in `app/layout.tsx`:
  - `Noto_Sans_Tamil` (subsets: ['tamil'], weights: 400/500/600/700) — body
  - `Lora` or `Crimson_Pro` — display/headlines (English)
- [ ] Create `components/ui/` base: Button, Input, Card, Badge, Avatar (via shadcn)
- [ ] **Bilingual label pattern** — every chrome label renders Tamil primary + English subtitle. Build a small helper:
  ```tsx
  // components/ui/BiLabel.tsx
  <BiLabel ta="புத்தகங்கள்" en="Books" />
  // renders: large Tamil + smaller muted English below or beside
  ```
- [ ] **Strings file** — `lib/strings.ts` central dictionary of `{ key: { ta, en } }` so future i18n is trivial. Avoid hardcoding labels in components.
- [ ] Create `components/layout/Header.tsx` — logo, nav using BiLabel (புத்தகங்கள்/Books, கட்டுரைகள்/Articles, என் கணக்கு/My Account, உள்நுழைய/Login), user menu, search icon (search itself is Phase 4 future-scope but icon placeholder ok)
- [ ] Create `components/layout/Footer.tsx` — about, contact, privacy, terms, refunds, social links
- [ ] Mobile-responsive nav with hamburger drawer
- [ ] Toast system (sonner via shadcn) — Tamil messages with English fallback

### 1.4 Authentication — Full Production Flow
- [ ] `lib/auth.ts` — JWT sign/verify with `jose`, password hash/verify with `bcryptjs`, cookie helpers, role guards (`requireRole('ADMIN')`)
- [ ] `lib/rate-limit.ts` — token-bucket rate limiter (in-memory for dev, Upstash Redis-ready for prod)
- [ ] `middleware.ts` — protect `/account/*`, `/admin/*`; role-based gate for admin; rate-limit headers
- [ ] **Registration:**
  - `app/api/auth/register/route.ts` — zod validation, dedup email/phone, creates user, generates `emailVerificationToken`, sends verification email, returns JWT
  - `app/(auth)/register/page.tsx` — name, email, phone, password, T&C checkbox
- [ ] **Email verification:**
  - `app/api/auth/verify-email/route.ts` — POST with token, sets `emailVerifiedAt`
  - `app/(auth)/verify-email/page.tsx` — landing page from email link
- [ ] **Login:**
  - `app/api/auth/login/route.ts` — verifies, increments `loginCount`, sets `lastLoginAt`, creates `Session` row, rate-limit (5/min per IP+email)
  - `app/(auth)/login/page.tsx` — editorial form with Tamil labels
- [ ] **Password reset:**
  - `app/api/auth/forgot-password/route.ts` — POST email, generates `passwordResetToken` (15min expiry), sends email — always returns 200 (no user enumeration)
  - `app/api/auth/reset-password/route.ts` — POST token + new password, validates expiry, updates hash, invalidates all sessions
  - `app/(auth)/forgot-password/page.tsx`
  - `app/(auth)/reset-password/page.tsx`
- [ ] **Logout:**
  - `app/api/auth/logout/route.ts` — POST, revokes current `Session`, clears cookie
  - `app/api/auth/logout-all/route.ts` — POST, revokes all sessions for user
- [ ] **Session info:**
  - `app/api/auth/me/route.ts` — GET, returns user + active subscription + sessions list
- [ ] **Account pages:**
  - `app/account/page.tsx` — profile overview
  - `app/account/security/page.tsx` — change password, active sessions, revoke device
  - `app/account/subscription/page.tsx` — current plan, expiry, renew CTA, payment history
- [ ] Test: register → verify email → login → reset password → logout-all flow

### 1.5 Homepage Shell
- [ ] `app/page.tsx` — placeholder hero ("தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு"), featured books grid (3-up), recent blogs (3-up), CTA section
- [ ] Pulls seeded data from DB
- [ ] Lighthouse: aim for 90+ on initial load

**Acceptance Criteria — Phase 1:**
- `npm run dev` starts cleanly on `http://localhost:3000`
- Prisma Studio shows schema with seed data
- Register/login/logout flow works end-to-end
- Homepage renders with Tamil fonts loaded correctly
- Mobile (375px) responsive

---

## Phase 2 — Public Content (Listing + Reader + PDF Viewer)

**Goal:** Anonymous and free users can browse and read.

### 2.1 Content Listing Pages
- [ ] `app/books/page.tsx` — grid of all PUBLISHED PDFs, cover + title + author + free/premium badge
- [ ] `app/books/[id]/page.tsx` — detail with cover, metadata, "Read" CTA
- [ ] `app/blogs/page.tsx` — list of PUBLISHED blogs
- [ ] `app/blogs/[id]/page.tsx` — blog reader, Tamil-optimized typography (line-height 1.8, max-width 65ch)
- [ ] `app/api/content/list/route.ts` — GET, optional auth, returns metadata only (respects tier)
- [ ] `app/api/content/[id]/route.ts` — GET, single content metadata
- [ ] Pagination: server-side, 12 per page

### 2.2 PDF Conversion API
- [ ] Install: `pdf-poppler` (or `pdf2pic`) + `sharp` + `@aws-sdk/client-s3` (R2 uses S3 SDK)
- [ ] **System dependency note in README:** poppler-utils must be installed on the host (Windows local: `choco install poppler`; Vercel: bundle via `@sparticuz/poppler` or use a layer)
- [ ] **Storage abstraction (`lib/storage.ts`):**
  ```ts
  interface StorageDriver {
    put(key: string, data: Buffer | Readable, contentType: string): Promise<void>
    get(key: string): Promise<Buffer | null>
    exists(key: string): Promise<boolean>
    stream(key: string): Promise<Readable | null>
    delete(key: string): Promise<void>
  }
  // Local driver (dev) + R2 driver (prod). Picked via STORAGE_DRIVER env.
  ```
- [ ] `app/api/convert/route.ts` — GET handler:
  - Validate Origin/Referer header (CORS check)
  - Validate JWT (Authorization Bearer OR `?token=` query param)
  - Look up user → check active Subscription via `Subscription` table (not the legacy enum)
  - If not active AND `page > 2` → 403
  - Cache check via storage layer: `storage.exists('cache/{doc_id}/page_{N}.webp')` → stream it
  - Else: storage.get pdf → convert page N to WebP via pdf-poppler + sharp → storage.put cache → stream
  - Apply watermark via sharp composite: "PREVIEW" for non-subscribers, user phone/email diagonal for subscribers
  - HTTP cache headers: `Cache-Control: public, max-age=31536000, immutable` (page WebPs are content-addressed by doc+page)
- [ ] Rate limit: 60 req/min per user
- [ ] Test with seeded PDF — verify cache hit on 2nd request (log timing)

### 2.3 PDF Viewer Component
- [ ] `components/viewer/CanvasViewer.tsx` — desktop only (≥768px), Canvas-based, fetches WebP from `/api/convert`, draws to canvas
- [ ] `components/viewer/MobileImgViewer.tsx` — mobile (<768px), `<img>` tags in locked container (`user-select: none`, `pointer-events: none`)
- [ ] `components/viewer/PdfReader.tsx` — viewport detector, picks viewer
- [ ] `components/viewer/PreviewBlur.tsx` — progressive blur overlay at end of page 2 for non-subscribers
- [ ] `components/viewer/SubscriptionPanel.tsx` — slide-up panel with book title + author + Subscribe CTA
- [ ] Right-click disabled on viewer container
- [ ] Keyboard shortcuts blocked: Ctrl+C, Ctrl+P, Ctrl+S
- [ ] Loading state per page

**Acceptance Criteria — Phase 2:**
- Anonymous user can browse books/blogs and read free content fully
- Premium book: pages 1-2 visible, paywall appears at end of page 2
- Mobile viewer locks pages (can't long-press save)
- WebP caching working — second view of same page hits cache (verify cache dir on disk)

---

## Phase 3 — Admin Dashboard + Payment

**Goal:** Admin can upload content; users can pay and unlock.

### 3.1 Admin Auth (Separate from User JWT)
- [ ] `lib/admin-auth.ts` — separate session cookie (different name, shorter TTL)
- [ ] `app/admin/login/page.tsx` — admin login form
- [ ] `app/api/admin/auth/route.ts` — POST, verifies against `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`
- [ ] Middleware: `/admin/*` requires admin session

### 3.2 Admin Dashboard UI — Production Coverage
- [ ] `app/admin/layout.tsx` — sidebar nav: Dashboard / Content / Authors / Categories / Subscribers / Plans / Coupons / Reviews / Comments / Newsletter / Audit Log / Settings
- [ ] `app/admin/page.tsx` — KPI cards: MTD revenue, active subs, churn %, MoM growth, top content, latest signups, pending reviews, error rate. Time-series chart (monthly revenue + active subs)
- [ ] **Content Management:**
  - `app/admin/content/page.tsx` — combined PDF + blog table, filter by type/status/category/author, bulk actions (publish/unpublish/delete)
  - `app/admin/content/new/page.tsx` — type selector (PDF/BLOG), then routes to specific form
  - `app/admin/content/[id]/edit/page.tsx` — metadata + categories + tags + authors + SEO (meta title, description, og image) + scheduling
  - PDF upload form: multipart, drag-drop, progress bar, auto-cover generation preview
  - Blog editor: TipTap configured for Tamil (Noto Sans Tamil), with image upload, code block, table, link
- [ ] **Authors:** `app/admin/authors/page.tsx` (list) + `[id]/edit/page.tsx` (full profile editor with photo upload)
- [ ] **Categories:** `app/admin/categories/page.tsx` — tree view with drag-to-reorder, create/edit/delete with parent picker
- [ ] **Tags:** `app/admin/tags/page.tsx` — list with use counts, merge tags
- [ ] **Series:** `app/admin/series/page.tsx` — manage multi-volume collections
- [ ] **Subscribers (Users):**
  - `app/admin/subscribers/page.tsx` — paginated table, filter by status/role/subscribed/banned, search by email/phone/name, export CSV
  - `app/admin/subscribers/[id]/page.tsx` — full user detail: profile, subscriptions history, payments, reading progress, reviews, comments, sessions, audit trail, manual actions (extend subscription / ban / unban / reset password / revoke sessions / change role)
- [ ] **Subscription Plans:**
  - `app/admin/plans/page.tsx` — CRUD plans (no more hardcoded ₹99)
  - Toggle active, feature on landing, edit pricing/duration
- [ ] **Coupons:**
  - `app/admin/coupons/page.tsx` — list + usage stats
  - `app/admin/coupons/new/page.tsx` — code, type, value, max uses, per-user limit, validity window, applies-to plan picker
- [ ] **Reviews Moderation:** `app/admin/reviews/page.tsx` — filter by status, approve/reject/flag, view reporter notes
- [ ] **Comments Moderation:** `app/admin/comments/page.tsx` — same UI pattern as reviews
- [ ] **Newsletter:** `app/admin/newsletter/page.tsx` — subscriber list, export CSV, unsub stats
- [ ] **Contact Submissions:** `app/admin/contact/page.tsx` — inbox view, assign, mark replied
- [ ] **Email Log:** `app/admin/emails/page.tsx` — recent sends, status filter, retry failed
- [ ] **Webhook Log:** `app/admin/webhooks/page.tsx` — Razorpay events, payload viewer, status, retry
- [ ] **Audit Log:** `app/admin/audit/page.tsx` — filter by user/entity/action, time range
- [ ] **Settings:** `app/admin/settings/page.tsx` — site name, tagline, support email, social links, hero config, maintenance mode toggle
- [ ] **Reporting:** `app/admin/reports/page.tsx` — revenue by plan, churn cohort, content engagement, top referrers (from ActivityLog)
- [ ] All admin UI: same design tokens, denser data layout, sortable/filterable tables, bulk actions, CSV export where useful
- [ ] All mutations write to `AuditLog`

### 3.3 PDF Upload Handler
- [ ] `app/api/admin/upload/route.ts` — POST multipart, admin-only
- [ ] Validates: PDF mime, max 50 MB
- [ ] Generates UUID, saves to `storage/pdfs/{uuid}.pdf`
- [ ] Auto-generates `storage/cache/{uuid}/page_1.webp` as cover (sharp)
- [ ] Inserts ContentMetadata row: `filePath`, `coverImageUrl = '/api/convert?doc_id={uuid}&page=1'`, status='DRAFT'
- [ ] Returns ID for further editing

### 3.4 Razorpay Payment Flow
- [ ] Install `razorpay` SDK
- [ ] `lib/razorpay.ts` — server-side client + HMAC signature helper
- [ ] `app/api/payment/create-order/route.ts` — POST, JWT-auth, creates Razorpay order, inserts Payment row (status=CREATED), returns order details
- [ ] `components/payment/RazorpayButton.tsx` — loads checkout.js, opens modal
- [ ] `app/api/payment/webhook/route.ts` — POST, validates HMAC signature, **dedup check** (skip if `razorpayPaymentId` already PAID), updates Payment, sets user `subscriptionStatus=ACTIVE`, `subscriptionExpiresAt = NOW() + 30d`
- [ ] `app/api/payment/verify/route.ts` — POST, client-side backup verification
- [ ] Test with Razorpay test cards (4111 1111 1111 1111)

**Acceptance Criteria — Phase 3:**
- Admin can log in, upload a PDF, see cover auto-generated, publish it
- User can click Subscribe on paywall, complete Razorpay test payment, immediately see all pages unlocked
- Webhook deduplication verified (replay same webhook → no double-activation)

---

## Phase 4 — Email, SEO, Anti-Piracy, Polish

### 4.1 Email Notifications (Nodemailer)
- [ ] Install: `nodemailer @types/nodemailer`
- [ ] `lib/email.ts` — Nodemailer transport (singleton), template renderer (React Email or simple HTML templates), `sendEmail()` helper that always writes to `EmailLog` first then sends, wrapping in try/catch
- [ ] Use a typed template registry (`emailType` enum → renderer function) so every send is traceable
- [ ] Templates (Tamil + English): welcome / activation, 3-day expiry reminder, expiry
- [ ] Trigger on successful payment (in webhook)
- [ ] Cron job: Vercel Cron (or external cron pinging `/api/cron/expiry-check`) runs daily
- [ ] `app/api/cron/expiry-check/route.ts` — finds users expiring in 3 days or expired today, fires emails, requires `CRON_SECRET` header

### 4.2 SEO Foundations (`/seo-technical` + `/seo-schema`)
- [ ] `app/sitemap.ts` — dynamic from DB (all PUBLISHED content)
- [ ] `app/robots.ts` — allow all, disallow `/admin/*`, `/api/*`, `/account/*`
- [ ] Per-page metadata via `generateMetadata`: title, description, OG, Twitter
- [ ] Canonical URLs
- [ ] JSON-LD via `/seo-schema`:
  - Organization (root layout)
  - WebSite with SearchAction
  - Book schema on book detail pages
  - Article schema on blog detail pages
  - BreadcrumbList on detail pages
- [ ] If Tamil + English content: hreflang via `/seo-engines-global`
- [ ] Run `/seo-audit-tools` 20-point AI readiness checklist before launch

### 4.3 Anti-Piracy Hardening
- [ ] Watermark applied server-side (sharp composite) — confirm visible at all zoom levels
- [ ] DevTools detection (optional) — blur viewer when devtools opens
- [ ] No raw URL access to `/storage/*` — verify via Next.js routing (storage outside `public/`)

### 4.4 Polish
- [ ] Loading skeletons on all data-fetched pages
- [ ] Error boundaries (`error.tsx` per segment)
- [ ] 404 page (`not-found.tsx`) — editorial style
- [ ] Empty states (no books, no subscribers, etc.)
- [ ] Accessibility: keyboard nav, focus rings, semantic HTML, alt text
- [ ] Run Lighthouse mobile + desktop — target 90+ on Performance, Accessibility, SEO

**Acceptance Criteria — Phase 4:**
- Welcome email arrives after test payment
- `sitemap.xml` and `robots.txt` valid
- Google Rich Results test passes for Book and Article pages
- Lighthouse SEO score ≥ 95

---

## Cross-Cutting Production Concerns

> **Don't defer these — wire them in as you build each phase.**

### Security Baseline
- [ ] **CSP headers** in `next.config.js` — script-src self, image-src self + razorpay, frame-src razorpay
- [ ] **CSRF protection** — double-submit cookie pattern for state-changing routes (auth + admin); origin check on every mutation
- [ ] **Rate limiting** — login (5/min), register (3/hour/IP), password reset (3/hour/email), webhook (no limit but verify HMAC), convert API (60/min/user)
- [ ] **Input validation** — zod schemas on every API route; never trust client
- [ ] **File upload safety:**
  - Magic byte check (not just MIME) for PDF uploads
  - Size cap enforced server-side
  - Filenames sanitized + UUID-renamed (never use user-supplied filename)
  - Storage path outside web root (`storage/` not `public/`)
- [ ] **SQL injection:** Prisma parameterizes — but never use `$queryRawUnsafe`
- [ ] **XSS:** TipTap output → sanitize with `isomorphic-dompurify` before storing AND on render
- [ ] **Password policy:** min 8 chars, zxcvbn strength check on register
- [ ] **Session security:** httpOnly + secure + sameSite=lax cookies; JWT 15min access + refresh token rotation
- [ ] **Admin audit trail:** every admin mutation writes to `AuditLog` with before/after
- [ ] **Webhook security:** HMAC SHA256 signature verify + `WebhookLog` dedup BEFORE business logic
- [ ] **No secrets in client bundle:** `NEXT_PUBLIC_*` only for public-safe values
- [ ] **Dependency audit:** `npm audit` clean before each release; Dependabot/Renovate enabled

### Observability
- [ ] **Structured logging:** `lib/logger.ts` — pino with redaction for emails/tokens; request ID per call
- [ ] **Error tracking:** Sentry (free tier) — capture server + client errors, source maps, ignore noisy browser extensions
- [ ] **Health endpoint:** `app/api/health/route.ts` — checks DB + storage + Razorpay reachability; used by uptime monitoring
- [ ] **Uptime monitoring:** UptimeRobot or Better Stack free tier pings `/api/health` every 5 min
- [ ] **Performance:** Vercel Analytics or self-hosted Plausible for RUM
- [ ] **Database query log:** Prisma slow query log in dev; production query insights via DB host

### Testing Strategy
- [ ] **Unit tests:** Vitest for `lib/*` (auth, rate-limit, JWT, password, razorpay helpers)
- [ ] **Integration tests:** Vitest + test DB for API routes (auth flow, payment webhook, convert with subscription gates)
- [ ] **E2E tests:** Playwright for critical paths (register → login → buy → read premium → logout)
- [ ] **Coverage target:** auth + payment + webhook = 90%+ (these are the money paths)
- [ ] **CI:** GitHub Actions — lint + typecheck + unit + integration on every PR

### GDPR-Lite / DPDP Act (India) Compliance
- [ ] **Privacy Policy page** (`app/legal/privacy/page.tsx`) — what we collect, why, retention
- [ ] **Terms of Service page** (`app/legal/terms/page.tsx`)
- [ ] **Refund Policy** (`app/legal/refunds/page.tsx`) — required by Razorpay
- [ ] **Cookie consent banner** — only if using non-essential cookies (analytics)
- [ ] **Account deletion:** `app/account/delete/page.tsx` — soft delete (`deletedAt`), purge PII after 30 days via cron
- [ ] **Data export:** `app/api/account/export/route.ts` — JSON dump of user's data
- [ ] **Marketing consent toggle** on register + account settings

### Performance & Caching
- [ ] **Image optimization:** `next/image` for all covers + author photos
- [ ] **Static generation where possible:** `generateStaticParams` for top-level book/blog pages, ISR with 60s revalidate
- [ ] **HTTP cache headers** on `/api/convert` — long max-age + immutable for cached pages (they're keyed by doc_id+page)
- [ ] **Database connection pooling:** Prisma + PgBouncer-equivalent if migrating; for MySQL keep connection_limit reasonable
- [ ] **Avoid N+1:** every list query uses `include` or batched lookup
- [ ] **Sharp image cache:** WebP conversions cached on disk per PROJECT_DOCS §13.2

### Backups & Recovery
- [ ] **DB backups:** Hostinger automated daily + weekly manual export to local for first 90 days
- [ ] **Storage backups:** PDFs and cache backed up to S3/R2 weekly (or daily if growing fast)
- [ ] **Restore drill:** document and test a restore-from-backup procedure once before public launch
- [ ] **Migration safety:** never `migrate reset` in prod; review every migration SQL before applying

---

## Phase 5 — Deployment Prep (Vercel + Cloudflare R2 + Hostinger MySQL)

### 5.1 Cloudflare R2
- [ ] Create Cloudflare account → R2 dashboard
- [ ] Create buckets: `etamil-pdfs` (private), `etamil-cache` (private)
- [ ] Create R2 API token with read/write on both buckets, copy keys
- [ ] Test R2 access from local with `STORAGE_DRIVER=r2` + populated R2 env vars

### 5.2 Database (Hostinger MySQL)
- [ ] Create MySQL DB on Hostinger control panel, note connection details
- [ ] Update Vercel env: `DATABASE_URL` pointing at remote MySQL (enable remote access on Hostinger first)
- [ ] Run `npx prisma migrate deploy` against prod DB
- [ ] Seed minimal prod data (admin user only — content seeded via admin UI)

### 5.3 Vercel Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Set all env vars from `.env.example` (prod values)
- [ ] `STORAGE_DRIVER=r2`
- [ ] Configure Vercel project: Node 20, Next.js framework auto-detect
- [ ] Add `vercel.json` if needed for cron + poppler binary
- [ ] **Poppler on Vercel:** install via `@sparticuz/poppler` npm package or bundle binary in `bin/`; verify convert API works
- [ ] Custom domain: connect, SSL auto-issues
- [ ] Vercel Cron: configure `/api/cron/expiry-check` daily

### 5.4 Razorpay
- [ ] Swap test → live keys when ready (keep test until QA passes)
- [ ] Configure webhook URL: `https://yourdomain.com/api/payment/webhook`
- [ ] Subscribe webhook to `payment.captured` event
- [ ] Test live payment with ₹1 order

### 5.5 SMTP / Nodemailer
- [ ] Choose final SMTP provider (Gmail with App Password / Hostinger SMTP / SendGrid / Mailgun)
- [ ] Configure SPF + DKIM DNS records on your domain (improves deliverability)
- [ ] Update `EMAIL_FROM` to a sending address on the verified domain
- [ ] Send test welcome email end-to-end → check inbox, spam, headers
- [ ] **Note:** Nodemailer doesn't track opens/clicks natively. If those metrics matter later, layer a tracking pixel or switch to a marketing-grade ESP.

### 5.6 Pre-Launch
- [ ] Run `/security-review` on full codebase
- [ ] Run `/simplify` on changed files
- [ ] Run `/seo-audit-tools` 20-point checklist
- [ ] Manual smoke test: register → verify email → browse → subscribe (test mode) → read premium → check email arrived → logout
- [ ] Smoke test admin: login → upload PDF → see auto-cover → publish → verify on public site
- [ ] Backup restore drill — actually restore from a Hostinger MySQL backup to confirm recovery works
- [ ] Switch Razorpay to live mode
- [ ] Announce 🎉

---

## File Storage Architecture (Locked)

| Environment | PDFs | WebP cache | Implementation |
|---|---|---|---|
| **Local dev (XAMPP)** | `./storage/pdfs/{uuid}.pdf` | `./storage/cache/{uuid}/page_{N}.webp` | Node `fs` |
| **Production (Vercel)** | Cloudflare R2 bucket `etamil-pdfs/{uuid}.pdf` | R2 bucket `etamil-cache/{uuid}/page_{N}.webp` | AWS SDK (S3-compatible) |

**Implementation:** `lib/storage.ts` exposes a single interface — `storage.put()`, `storage.get()`, `storage.exists()`. Driver switches via `STORAGE_DRIVER=local|r2` env var. Phase 1 ships only the `local` driver; R2 driver added at end of Phase 2 (before prod deploy).

**Convert API behavior:** identical in both envs — checks cache, reads source, writes cache, streams. Storage layer is the only abstraction.

**Cloudflare R2 setup (one-time, before prod deploy):**
- Create Cloudflare account → R2 → 2 buckets: `etamil-pdfs` (private), `etamil-cache` (private)
- Generate API token with R2 read/write scope
- Set env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_PDFS`, `R2_BUCKET_CACHE`
- Both buckets stay private — convert API is the only public access path

---

## Out of Scope for v1 (per PROJECT_DOCS §13.12-14)

- Reading progress tracking
- Full-text search
- Advanced analytics (pages-per-session, drop-off)
- Razorpay recurring subscriptions (we use Orders API only)
- Multiple admin accounts (single hardcoded admin)

---

## How to Run This Plan

1. **One phase at a time.** Don't start Phase 2 until Phase 1 acceptance criteria are met.
2. **Invoke skills at the listed phases** — don't try to do design + SEO + code in one pass.
3. **Commit at end of each numbered subsection** with a descriptive message.
4. **Update this file** if scope changes — mark items `[x]` when done, add notes inline.
