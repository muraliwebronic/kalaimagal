# Kalaimagal · கலைமகள்

**Tamil-first e-book + blog subscription platform.** Single Next.js 16 app with Prisma, MySQL, Cloudflare R2 (prod-deferred), Razorpay test mode. See [task.md](task.md) for the phase-by-phase plan and [CLAUDE.md](CLAUDE.md) for architecture conventions.

This README is your **manual-test cheat-sheet**: every URL to click through, every credential to log in with, what to expect at each step. Update it as you build new features.

---

## Quick start

```bash
# 1. Make sure XAMPP MySQL is running (database "etamil" must exist)
# 2. Boot the app
npm install
npm run dev
# → http://localhost:3000
```

If you nuked the DB and need to start over:
```bash
npx prisma migrate dev    # apply schema
npx prisma db seed        # seeds admin + plan + categories + sample content + WELCOME10 coupon + settings
```

Inspect the DB visually: `npx prisma studio` → http://localhost:5555

---

## Test credentials

### Admin (SUPER_ADMIN) — seeded
| | |
|---|---|
| URL | http://localhost:3000/admin/login |
| Email | `admin@gmail.com` |
| Password | `password@123` |
| Role | `SUPER_ADMIN` |
| Note | `forcePasswordChangeOnNextLogin=true` is set on the seed, but the force-change UI ships in Phase 4 — for now it just lives as a flag in DB. |

### Test user — create your own
| | |
|---|---|
| URL | http://localhost:3000/register |
| Suggested email | `test@example.com` |
| Suggested password | `testpass123` |

After registering, you'll be logged in automatically. The verification email **prints to the dev-server console** (SMTP isn't wired yet — see [Email stub](#email-stub) below). Copy the link from the terminal to verify, or skip — email verification is **soft** so you can subscribe and browse without it.

### Razorpay (test mode)
| | |
|---|---|
| Key ID | `rzp_test_SYUQHezAmitAOg` |
| Key Secret | `QvF0A0cUSYTx7b3DxSiP1iNg` |
| Webhook Secret | _(not yet set — generate from the Razorpay dashboard when wiring the live webhook)_ |
| Test card | `4111 1111 1111 1111`, any future expiry, any CVV, any name |
| Test UPI | `success@razorpay` |

### Coupon (seeded)
| | |
|---|---|
| Code | `WELCOME10` |
| Type | PERCENTAGE |
| Value | 10% off |
| Max uses | 1000 |
| Per-user limit | 1 |
| Valid until | 90 days from first seed run |

### Database
| | |
|---|---|
| Host | `localhost:3306` (XAMPP MariaDB 10.4.32) |
| DB | `etamil` |
| User | `root` |
| Password | _(none)_ |
| DSN | `mysql://root:@localhost:3306/etamil` |

### Demo PDF
The seeded `bharathi-padalgal-sample` (free, id=1) and `ponniyin-selvan-vol-1` (premium, id=2) both point at a 144-page demo file you supplied at `public/uploads/pdfs/cf3077ca-f0f7-48c7-8909-162f52542a99.pdf` (.gitignored).

---

## Click-through paths

### Public site

| Path | What you'll see |
|---|---|
| **/** | Editorial homepage: hero with Tamil tagline, featured books, recent articles, subscribe CTA. Pulls data from `Setting` rows + Content. |
| **/books** | Paginated grid of all published PDFs (12 per page). Filter by category via `?category=naaval`. |
| **/books/bharathi-padalgal-sample** | Detail page — cover, metadata, "Read" CTA. (Free.) |
| **/books/bharathi-padalgal-sample/read** | **Free PDF reader.** All 144 pages readable, no paywall. |
| **/books/ponniyin-selvan-vol-1** | Detail page — premium PDF. Shows "first 2 pages free" hint. |
| **/books/ponniyin-selvan-vol-1/read** | **Premium PDF reader.** Pages 1-2 render normally. Page 3+ → server returns HTTP 403; viewer shows page 2 blurred + slide-up Subscribe panel. |
| **/blogs** | Paginated grid of blog articles. |
| **/blogs/tamil-ilakkiya-varalaru** | **Blog reader** with Tamil-optimized typography (line-height 1.85, max-width 65ch). |

### Auth flow

| Path | What it does |
|---|---|
| **/register** | Create a user. Submits to `/api/auth/register`, sets cookies, sends verification email (to dev console — see below). Redirects to `/account?welcome=1`. |
| **/login** | Sign in. Submits to `/api/auth/login`. Redirects to `/account`. |
| **/forgot-password** | Request reset link. Submits to `/api/auth/forgot-password` (always returns 200 to prevent user enumeration). |
| **/reset-password?token=…** | Consume reset link (15-min TTL). Revokes all sessions on success. |
| **/verify-email?token=…** | Consume verification token from the welcome email. |

### Account (signed in)

| Path | What you'll see |
|---|---|
| **/account** | Profile card with role/verified/subscribed badges, current subscription status, logout button. |
| **/account/subscription** | Plan + expiry + payment history + **Razorpay Subscribe button** (only if no active subscription). |
| **/account/security** | Active device sessions + "Logout everywhere" + link to /forgot-password to change pw. |

### Language toggle (TA ↔ EN)
- Visible in the header (next to user actions) on every public page.
- Default: **Tamil** (`data-lang="ta"` on `<html>`, sets `kalaimagal_lang` cookie).
- Click to flip → English chrome shows, Tamil chrome hides.
- **What switches:** nav items, section headings, brand tagline, CTAs, badges, empty states, subscription panel chrome — anything wrapped with `data-bi`.
- **What does NOT switch:** book titles, blog body text, author names, hero illustrations, anything tagged `lang="ta"` *without* `data-bi`. Those are content and stay visible regardless of mode.
- The toggle posts to `/api/user/lang` which sets the cookie and the page re-renders.

### Admin

Login at **/admin/login** with the seeded SUPER_ADMIN above. After login you land on the dashboard.

| Path | What it does |
|---|---|
| **/admin** | KPI cards: MTD revenue, active subs, total users, PDFs/blogs published, pending payments. Recent signups + payments lists. |
| **/admin/content** | All published / draft content (PDFs + blogs together). Filter by type/status. |
| **/admin/content/new?type=PDF** | **Upload a PDF.** Pick a file → progress bar → cover auto-generates → lands on edit page. |
| **/admin/content/new?type=BLOG** | **Write a blog.** Title + slug + Markdown/HTML body (sanitized server-side via DOMPurify). |
| **/admin/content/[id]/edit** | Full metadata editor + Publish / Unpublish / Delete (soft delete). |
| **/admin/subscribers** | All users, searchable + role filter. Click a user for detail. |
| **/admin/subscribers/[id]** | Profile, all subscriptions, payments, active sessions, **inline Actions**: Extend +30d, Ban/Unban, Send password reset (link prints to console). |
| **/admin/plans** | Subscription plans CRUD. Single seeded plan: Monthly ₹99 / 30 days. |
| **/admin/coupons** | Coupons CRUD. Seeded with `WELCOME10`. |
| **/admin/settings** | All 17 `Setting` rows in a JSON-per-key editor with live JSON parse validation. Batched save. |

### Admin language toggle (EN ↔ TA)
- Visible in admin top-bar (next to logout) on every admin page.
- Default: **English** (`kalaimagal_admin_lang` cookie, separate from public-site cookie).
- Click to flip — all admin labels switch.

---

## Payment flow walk-through (test mode)

1. Register a fresh user at **/register** (or log in as an existing non-admin).
2. Open a premium book reader: **/books/ponniyin-selvan-vol-1/read**.
3. Click **Next page** until you hit page 3 → paywall appears (page 2 blurred, slide-up panel shows the book title + ₹99/month CTA).
4. Click the **Subscribe** button on the panel → Razorpay checkout modal opens with your name/email pre-filled.
5. Pay with test card **`4111 1111 1111 1111`** · any future expiry (e.g., `12/30`) · any CVV (e.g., `123`) · any name. Complete OTP if asked (`1234`).
6. Razorpay returns success → client posts to `/api/payment/verify` → server activates subscription → page redirects to **/account/subscription?welcome=1**.
7. Go back to **/books/ponniyin-selvan-vol-1/read** → all 144 pages now load past the paywall.

The **webhook** path (`/api/payment/webhook`) runs in parallel with the client-side verify; whichever arrives first activates the subscription, the other becomes a no-op via the `status=PAID` check. The webhook needs a publicly-reachable URL (use `ngrok http 3000` and configure the Razorpay dashboard webhook to `https://<your-ngrok-url>/api/payment/webhook` if you want to test it end-to-end).

### Try the coupon
On the **/account/subscription** Subscribe button, the coupon code box isn't wired yet (Phase 4 polish) — but the API supports it. To manually test:
```powershell
$body = '{"planSlug":"monthly","couponCode":"WELCOME10"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/payment/create-order" -Method POST -ContentType "application/json" -Body $body -Headers @{ "Origin" = "http://localhost:3000" } -WebSession $session
# → discount ₹9.90, net ₹89.10
```

---

## Email stub

Phase 1.4 ships email sending without SMTP credentials. When `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` are blank in `.env.local`:

- `sendEmail()` writes a row to the `EmailLog` table (`status: SENT`, `providerMessageId: console:<id>`).
- The full email body — including the verification or password-reset **link with token** — prints to the dev-server terminal in a box marked `📧 EMAIL (stub)`.

To copy the verification link from the console after registering:
```
──────────────── 📧 EMAIL (stub) ────────────────
 To:      test@example.com
 Type:    verify-email
 …
 http://localhost:3000/verify-email?token=13cYVKwZAtZqOVlv-rGEYVbSee5T0Nie4JkNBi6NXZU
─────────────────────────────────────────────────
```
Paste the URL into the browser to verify.

**To switch to real email (Phase 4.1):** fill `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` in `.env.local` and restart. The Nodemailer transport auto-activates with no code change.

---

## Smoke tests already run

Each phase commit ships with smoke-test evidence. Quick replay if you want to verify locally:

```powershell
# After `npm run dev`

# Login as test user → /api/auth/me
$body = '{"email":"test@example.com","password":"testpass123"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body -SessionVariable s
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" -WebSession $s | Select-Object -ExpandProperty Content

# Convert API (Origin guard + cache)
$h = @{ "Origin" = "http://localhost:3000" }
Invoke-WebRequest -Uri "http://localhost:3000/api/convert?doc_id=1&page=1" -Headers $h -OutFile page1.webp
# WebP file written to disk

# Razorpay order create (must be signed in)
$body = '{"planSlug":"monthly"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/payment/create-order" -Method POST -ContentType "application/json" -Body $body -Headers $h -WebSession $s
```

---

## Common commands

```bash
# Dev
npm run dev             # localhost:3000
npm run build           # production build (slow first time — Turbopack + Prisma)
npm start               # production server

# Database
npx prisma migrate dev          # apply pending migrations
npx prisma db seed              # idempotent — safe to re-run
npx prisma studio               # DB browser → localhost:5555
npx prisma generate             # regen client after schema changes

# Custom
npx tsx scripts/test-pdf-render.ts  # standalone PDF render check (writes test-render-page1.webp)
```

---

## Known limitations + Phase 4 polish list

- **Header doesn't yet hide Login/Register when signed in** — both buttons show always. Phase 4.4 polish.
- **Toast notifications**: `sonner` is installed but not wired anywhere yet.
- **Loading skeletons, error boundaries, 404 page**: minimal — Phase 4.4.
- **TipTap blog editor**: deferred. Admin uses sanitized HTML/Markdown textarea.
- **Authors / Categories / Tags / Series admin CRUD**: editable only via Prisma Studio for now.
- **Reviews / Comments moderation, Newsletter, Reports, Log viewers**: schemas exist, admin UI deferred.
- **Coupon code field on /account/subscription Subscribe button**: API supports `couponCode`, UI doesn't expose it yet.
- **Lang toggle coverage**: works in Header / Footer / Homepage / ContentCard / SubscriptionPanel / `/account` / (auth) layout. Some inner pages (RegisterForm, LoginForm, account/security, account/subscription, books/[slug] detail, blogs/[slug] reader, forgot/reset password forms) still have unmarked `lang="ta"` + `lang="en"` pairs from before the toggle existed — they show both languages regardless of mode. Easy fix: add `data-bi` to those pair spans as you touch them.
- **Real Razorpay webhook**: needs a public URL. Locally, use `ngrok http 3000` and add the ngrok URL to the Razorpay dashboard.
- **`middleware.ts` deprecation warning**: Next 16 prefers `proxy.ts` filename. File works; rename pending.

---

## File map at a glance

```
src/app/
  (auth)/                       login, register, forgot/reset password, verify-email
  page.tsx                      homepage
  books/                        list, [slug] detail, [slug]/read viewer
  blogs/                        list, [slug] reader
  account/                      profile, security, subscription (auth-gated)
  admin/login/                  admin sign-in
  admin/(shell)/                dashboard + content + subscribers + plans + coupons + settings
  api/
    auth/                       register, login, logout, logout-all, refresh, me,
                                verify-email, forgot-password, reset-password
    content/                    public list + [slug]
    convert/                    PDF→WebP renderer + paywall enforcement
    payment/                    create-order, verify, webhook (Razorpay)
    user/lang/                  public-site lang cookie setter
    admin/                      content (POST/PATCH/DELETE), upload, plans, coupons,
                                subscribers (actions), settings, lang

src/components/
  ui/                           shadcn primitives + BiLabel
  layout/                       Header, Footer, UserLangToggle
  content/                      ContentCard, Pagination
  viewer/                       PdfReader, CanvasViewer, MobileImgViewer,
                                PreviewBlur, SubscriptionPanel
  admin/                        AdminSidebar, AdminTopBar, AdminLogoutButton, LangToggle
  payment/                      RazorpayButton

src/lib/
  auth.ts                       JWT + bcrypt + session helpers + cookie config
  db.ts                         Prisma singleton (MariaDB adapter)
  email.ts                      Nodemailer (auto-switches between SMTP and dev-console stub)
  rate-limit.ts                 In-memory token bucket
  storage.ts                    Storage abstraction (local | r2 driver)
  pdf-render.ts                 pdfjs-dist + @napi-rs/canvas + sharp pipeline
  razorpay.ts                   Razorpay SDK + HMAC helpers
  content.ts                    Public content queries + DTOs
  settings.ts                   Setting model reader
  strings.ts                    Public-site dictionary { en, ta }
  user-lang.ts                  Public-site language cookie helper
  admin/
    auth.ts                     requireAdmin / requireSuperAdmin
    lang.ts                     Admin lang cookie helper
    strings.ts                  Admin-side dictionary { en, ta }

prisma/
  schema.prisma                 31 models, 18 enums
  migrations/                   committed migration history
  seed.ts                       idempotent seed (admin + plan + categories + sample content + coupon + 17 settings)

public/uploads/                 dev-only PDF + WebP cache (.gitignored)
                                ⚠ MUST swap to Cloudflare R2 before prod launch
```
this is the kalaigamagal project 
