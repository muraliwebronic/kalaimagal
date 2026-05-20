# Tamil Premium Publication Platform — Full Project Documentation

> **For Claude Code:** This document is the single source of truth for this project. Read it entirely before writing any code. Follow the architecture, schema, and workflow exactly as described.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Deployment](#2-tech-stack--deployment)
3. [Architecture Diagram](#3-architecture-diagram)
4. [Domain Structure](#4-domain-structure)
5. [Database Schema](#5-database-schema)
6. [Feature Requirements](#6-feature-requirements)
7. [Paywall & Preview Workflow](#7-paywall--preview-workflow)
8. [Razorpay Payment Flow](#8-razorpay-payment-flow)
9. [Anti-Piracy Measures](#9-anti-piracy-measures)
10. [API Endpoints Reference](#10-api-endpoints-reference)
11. [Environment Variables](#11-environment-variables)
12. [Folder Structure](#12-folder-structure)
13. [Confirmed Architecture Decisions & Implementation Rules](#13-confirmed-architecture-decisions--implementation-rules)
14. [File Storage Reference](#14-file-storage-reference)

---

## 1. Project Overview

| Field | Value |
|---|---|
| Platform Type | Secure content-subscription platform |
| Content Type | Tamil e-books (PDFs), Tamil blog articles |
| Primary Language | Tamil Unicode (~95% of content) |
| Business Model | Free Tier + Monthly Premium Subscription |
| Payment Gateway | Razorpay (INR, 30-day manual or recurring) |
| Hosting | Hostinger Business / Cloud Plan |

---

## 2. Tech Stack & Deployment

| Layer | Technology |
|---|---|
| Frontend & User App | Next.js (Node.js, Hostinger managed panel) |
| Admin UI | Next.js Static Export (`output: 'export'`) |
| Backend Engine | PHP 8.x (Hostinger native) |
| PDF Processing | PHP ImageMagick (`Imagick` extension) |
| PDF Storage | Hostinger File Storage (local disk, `/storage/pdfs/`) |
| Database | MySQL (Hostinger managed) |
| Payments | Razorpay Checkout + Webhooks |
| Image Format | WebP (converted from PDF pages on-the-fly) |

---

## 3. Architecture Diagram

```
                        +-----------------------------+
                        |   HOSTINGER FILE STORAGE    |
                        |  /storage/pdfs/{doc_id}.pdf |
                        |  /cache/{doc_id}/{page}.webp|
                        +-------------+---------------+
                                      ^
                                      | Local disk read (no API quota)
                                      v
+----------------------+   Secure JSON  +-----------------------------+
|  USER FRONTEND       | <============> |   BACKEND ENGINE (PHP 8.x)  |
|  yourdomain.com      |  Image Source  |   api.yourdomain.com/api/   |
|  (Next.js Node App)  |                |   (Hostinger PHP + Imagick) |
+-----------+----------+                +--------------+--------------+
            |                                          |
            | Auth / Subscription check                | Read / Write
            v                                          v
+----------------------+                 +-----------------------------+
|   Next.js API Routes |                 |       MYSQL DATABASE        |
|   (JWT validation,   | <=============> | users, content_metadata,    |
|   Razorpay order     |                 | payments                    |
|   creation)          |                 +-----------------------------+
+----------------------+
            |
            | Webhook events
            v
+----------------------+
|  razorpay-webhook.php|
|  Validates signature |
|  Activates user      |
+----------------------+
```

---

## 4. Domain Structure

### `yourdomain.com` — End-User Application

- **Runtime:** Node.js (Next.js fullstack)
- **Responsibilities:**
  - Public homepage, content listing pages
  - User registration, login, JWT-based sessions
  - Free blog and PDF reading
  - Premium paywall enforcement (frontend layer)
  - Razorpay Checkout modal integration
  - HTML5 Canvas secure PDF viewer (subscribed users)

### `api.yourdomain.com` — Admin Dashboard + Backend Engine

- **Runtime:** PHP 8.x (native Hostinger)
- **Admin UI:** Next.js static export served from `/public_html/`
- **Key PHP scripts:**

| Path | Purpose |
|---|---|
| `/api/convert.php` | Reads PDF from Hostinger local storage, converts pages to watermarked WebP via Imagick. Serves from WebP cache if available. Enforces page limit for non-subscribers. |
| `/api/razorpay-webhook.php` | Receives Razorpay webhook events, validates HMAC signature, activates user subscription in DB. |
| `/api/admin-auth.php` | Authenticates admin users (separate from subscriber auth). |

---

## 5. Database Schema

### Table: `users`

```sql
CREATE TABLE users (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                  VARCHAR(150) NOT NULL,
  email                 VARCHAR(255) UNIQUE NOT NULL,
  phone                 VARCHAR(20),
  password_hash         VARCHAR(255) NOT NULL,
  subscription_status   ENUM('ACTIVE', 'INACTIVE') DEFAULT 'INACTIVE',
  subscription_expires_at DATETIME DEFAULT NULL,
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `content_metadata`

```sql
CREATE TABLE content_metadata (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type              ENUM('PDF', 'BLOG') NOT NULL,
  title_tamil       VARCHAR(500) NOT NULL,
  title_english     VARCHAR(500),
  author            VARCHAR(255),
  description       TEXT,
  google_drive_id   VARCHAR(255) DEFAULT NULL,   -- RENAMED: use file_path instead. Kept for migration reference only.
  file_path         VARCHAR(500) DEFAULT NULL,    -- Relative path: 'pdfs/{uuid}.pdf' (NULL for blogs)
  body_text         LONGTEXT DEFAULT NULL,        -- NULL for PDFs
  is_premium        TINYINT(1) DEFAULT 0,         -- 0 = Free, 1 = Locked
  status            ENUM('PUBLISHED', 'DRAFT') DEFAULT 'DRAFT',
  cover_image_url   VARCHAR(500) DEFAULT NULL,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: `payments`

```sql
CREATE TABLE payments (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id               INT UNSIGNED NOT NULL,
  razorpay_payment_id   VARCHAR(100),
  razorpay_order_id     VARCHAR(100),
  razorpay_subscription_id VARCHAR(100) DEFAULT NULL,
  amount                DECIMAL(10, 2) NOT NULL,
  currency              VARCHAR(10) DEFAULT 'INR',
  status                ENUM('CREATED', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'CREATED',
  payment_date          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 6. Feature Requirements

### 6A. Admin Dashboard (`api.yourdomain.com`)

#### Document (PDF) Management
- Fields: Book Title (Tamil + English), Author Name, Description, Google Drive File ID, Cover Image URL, Availability Status (Published/Draft), Content Tier (Free / Subscription Only)
- CRUD operations for all fields
- Preview metadata before publishing

#### Blog/Article Management
- Rich text editor with full Tamil Unicode support (use a library like TipTap or Quill)
- Content Tier: Free vs. Subscription Only
- Draft/Publish workflow

#### Subscriber Management
- List all users with: name, email, phone, subscription status, start/end date
- Filter by status (Active / Inactive / Expired)
- Manual override: activate or extend subscription for a specific user
- View per-user payment history

#### Revenue Dashboard
- Month-to-Date (MTD) revenue total
- Active subscribers count
- Churn indicator (subscribers lost this month)
- Basic growth graph (monthly subscribers over time)
- Data sourced directly from `payments` and `users` tables

---

### 6B. User-Facing App (`yourdomain.com`)

#### Anonymous / Free Users
- Read all Free Blogs fully
- Read all Free PDFs fully (rendered via Canvas or standard viewer)
- View metadata (Title, Author, Description, Cover) for Premium content — but cannot access pages

#### Subscribed Users
- Unlimited access to all PDFs and blogs
- PDF pages rendered in HTML5 Canvas with anti-piracy measures (see Section 9)

---

## 7. Paywall & Preview Workflow

This is the core engagement mechanic. Implement exactly as described.

### Step-by-step flow for a Premium PDF:

```
Non-subscribed user clicks a Premium PDF
         |
         v
Next.js requests Page 1 + Page 2 from api.yourdomain.com/api/convert.php
         |
         v
PHP checks user subscription status via DB
  - If NOT subscribed: only serves pages 1 and 2 (hard limit enforced server-side)
  - If subscribed: serves any requested page
         |
         v
PHP fetches PDF from Google Drive (using Service Account credentials)
Converts requested pages to WebP using Imagick
Overlays a diagonal watermark ("PREVIEW") on non-subscribed renders
Streams WebP back to Next.js
         |
         v
Next.js displays Page 1 and Page 2 as images
         |
         v
As user scrolls to bottom of Page 2:
  - Progressive blur overlay fades in over the content
  - Subscription Panel slides up smoothly
         |
         v
Subscription Panel displays:
  "To continue reading '[Book Title]' by [Author Name],
   activate your Monthly Plan now."
  [Subscribe for ₹XX/month] button
```

### Subscription Panel Content
- Dynamic: pulls actual book title and author name from content metadata
- CTA button triggers the Razorpay payment flow
- Panel should be dismissible but reappears on any scroll attempt past page 2

---

## 8. Razorpay Payment Flow

```
User clicks "Subscribe" on the Subscription Panel
         |
         v
Next.js API Route calls Razorpay API → creates an Order (or Subscription)
Returns: { order_id, amount, currency, key_id }
         |
         v
Razorpay Checkout Modal opens in browser
Supports: UPI, Credit/Debit Cards, Net Banking, Wallets
         |
         v
User completes payment
         |
         v
Razorpay fires webhook to: api.yourdomain.com/api/razorpay-webhook.php
Event: payment.captured
         |
         v
PHP webhook handler:
  1. Validates X-Razorpay-Signature using HMAC SHA256 (webhook secret)
  2. Looks up user by razorpay_order_id
  3. Updates payments table (status = 'PAID')
  4. Updates users table:
       subscription_status = 'ACTIVE'
       subscription_expires_at = NOW() + INTERVAL 30 DAY
         |
         v
Next.js frontend polls or receives response → unlocks Canvas reader
```

### Important Implementation Notes
- **Always validate the Razorpay webhook signature** before trusting the event
- Store `razorpay_order_id` when creating the order so you can look up the user during the webhook
- For recurring subscriptions, handle `subscription.charged` event to auto-renew
- Keep the Razorpay secret key only on the server (never expose to browser)

---

## 9. Anti-Piracy Measures

Applied to all subscribed users viewing Premium PDFs:

| Measure | Implementation |
|---|---|
| Canvas rendering | All PDF pages rendered to `<canvas>` elements — no raw image URLs exposed |
| Right-click disabled | `contextmenu` event suppressed on canvas |
| Keyboard shortcuts blocked | `Ctrl+C`, `Ctrl+P`, `Ctrl+S` preventDefault on canvas container |
| Dynamic watermark | User's phone number or email overlaid diagonally across each canvas page |
| DevTools detection | (Optional) Detect open DevTools and blur content |
| No direct URL | PDF pages are served as streamed WebP from PHP — not as static file URLs |

### Watermark Spec
- Text: user's phone number (preferred) or email
- Style: semi-transparent (20–30% opacity), diagonal (45°), repeated tiled pattern across the canvas
- Applied server-side in Imagick for subscribed users (different from the "PREVIEW" watermark for non-subscribers)

---

## 10. API Endpoints Reference

### PHP Backend (`api.yourdomain.com/api/`)

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/convert.php` | GET | JWT (cookie or header) | Returns a single PDF page as WebP. Params: `?doc_id=&page=&token=` |
| `/razorpay-webhook.php` | POST | Razorpay HMAC signature | Receives payment events, activates subscriptions |
| `/admin-auth.php` | POST | Admin credentials | Returns admin session token |

### Next.js API Routes (`yourdomain.com/api/`)

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | None | Create new user account |
| `/api/auth/login` | POST | None | Returns JWT on success |
| `/api/auth/me` | GET | JWT | Returns current user info + subscription status |
| `/api/content/list` | GET | Optional | Returns content list (metadata only, respects tier) |
| `/api/content/[id]` | GET | Optional | Returns single content metadata |
| `/api/payment/create-order` | POST | JWT | Creates Razorpay order, returns order details |
| `/api/payment/verify` | POST | JWT | Client-side verification after payment (backup to webhook) |

---

## 11. Environment Variables

### `yourdomain.com` (Next.js App — `.env.local`)

```env
# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Database
DB_HOST=localhost
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Auth
JWT_SECRET=your_jwt_secret_here

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxx

# Subscription
SUBSCRIPTION_PRICE_INR=99
SUBSCRIPTION_DURATION_DAYS=30
```

### `api.yourdomain.com` (PHP — `config.php`)

```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_db_name');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');

define('JWT_SECRET', 'your_jwt_secret_here');
define('RAZORPAY_WEBHOOK_SECRET', 'your_webhook_secret');

define('STORAGE_BASE_PATH', '/home/{hostinger_user}/storage');
define('PDF_DIR', STORAGE_BASE_PATH . '/pdfs/');
define('CACHE_DIR', STORAGE_BASE_PATH . '/cache/');

define('ALLOWED_ORIGIN', 'https://yourdomain.com');
?>
```

---

## 12. Folder Structure

### `yourdomain.com` (Next.js)

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Homepage
│   │   ├── books/
│   │   │   ├── page.tsx              # Book listing
│   │   │   └── [id]/page.tsx         # Book detail + viewer
│   │   ├── blogs/
│   │   │   ├── page.tsx              # Blog listing
│   │   │   └── [id]/page.tsx         # Blog reader
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── api/
│       ├── auth/
│       ├── content/
│       └── payment/
├── components/
│   ├── CanvasViewer.tsx              # Secure PDF canvas renderer
│   ├── SubscriptionPanel.tsx         # Paywall slide-up panel
│   ├── PreviewBlur.tsx               # Blur overlay at page 2 end
│   └── RazorpayButton.tsx            # Checkout trigger
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── razorpay.ts
└── middleware.ts                     # JWT check for protected routes
```

### `api.yourdomain.com` (PHP + Static Admin)

```
public_html/
├── index.html                        # Static admin dashboard (Next.js export)
├── _next/                            # Next.js static assets
├── api/
│   ├── config.php
│   ├── convert.php                   # PDF → WebP engine
│   ├── razorpay-webhook.php          # Payment webhook handler
│   └── admin-auth.php
└── .htaccess                         # CORS headers, route rules
```

---

## 13. Confirmed Architecture Decisions & Implementation Rules

These are **not suggestions** — they are finalized decisions. Claude Code must implement all of the following exactly as described.

---

### 🔴 Critical — Implement These From Day One

**1. PDF Storage: Hostinger Local File Storage (NOT Google Drive)**
PDFs are stored directly on Hostinger's file system. Google Drive is not used.
- **Upload path:** Admin uploads PDFs via the admin dashboard. PHP saves them to `/storage/pdfs/{doc_id}.pdf` (outside `public_html` so they are never directly URL-accessible).
- **`google_drive_id` column:** Rename this to `file_path` in `content_metadata`. Store the relative path like `pdfs/doc_123.pdf`.
- **No Drive API, no service account credentials needed.**

**2. WebP Page Caching (Required)**
`convert.php` must cache every converted page to disk. Never re-convert a page that already exists in cache.

```
/storage/
  pdfs/
    {doc_id}.pdf              ← original PDF (admin-uploaded)
  cache/
    {doc_id}/
      page_1.webp             ← cached converted pages
      page_2.webp
      page_N.webp
```

Logic in `convert.php`:
```
1. Check if /storage/cache/{doc_id}/page_{N}.webp exists
2. If YES → stream it directly (fast path)
3. If NO  → read /storage/pdfs/{doc_id}.pdf, convert page N via Imagick, save to cache, then stream
```

**3. Shared JWT Between Next.js and PHP**
Both `yourdomain.com` (Next.js) and `api.yourdomain.com` (PHP) use the same `JWT_SECRET`.
- Next.js signs and issues JWTs on login.
- `convert.php` must decode and verify the JWT using a PHP JWT library (e.g., `firebase/php-jwt` via Composer, or a hand-written HS256 verifier if Composer is unavailable on Hostinger).
- If the token is missing, expired, or invalid → return HTTP 401.
- If the user is not subscribed and `page > 2` → return HTTP 403.

**4. Webhook Deduplication (Required)**
Before activating any subscription from a webhook:
```sql
SELECT id FROM payments WHERE razorpay_payment_id = ? AND status = 'PAID'
```
If a row is found → skip processing, return HTTP 200 (acknowledge to Razorpay without re-activating).
If not found → process normally, insert/update record, activate user.

**5. Email Notifications (Required)**
Use a transactional email provider. **Recommended: Resend** (simple REST API, no SMTP setup needed).
Send emails for these events:

| Trigger | Email Content |
|---|---|
| Successful subscription | "Your plan is active until [date]. Welcome!" |
| 3 days before expiry | "Your subscription expires on [date]. Renew now." |
| Subscription expired | "Your access has ended. Resubscribe to continue reading." |

A daily cron job on Hostinger must check `subscription_expires_at` and fire the reminder/expiry emails.

**6. Subscription Model: Manual Renewal (Razorpay Orders API)**
This project uses **manual 30-day renewal** — not Razorpay Subscriptions API.
- Use `Razorpay Orders API` to create a one-time order on each subscribe/renew click.
- Webhook event to handle: `payment.captured`
- On capture: set `subscription_expires_at = NOW() + INTERVAL 30 DAY`
- Do NOT implement Razorpay Subscriptions, plans, or `subscription.charged` events.

---

### 🟡 Important — Must Also Implement

**7. Cover Image: Auto-Generate from Page 1**
When a PDF is uploaded by admin, `convert.php` (or an upload handler) must automatically generate `/storage/cache/{doc_id}/page_1.webp` and store that path as the `cover_image_url` in `content_metadata`. Admin does not manually upload cover images.

**8. Tamil Font: Noto Sans Tamil**
The entire `yourdomain.com` app must use `Noto Sans Tamil` as the base body font.
```tsx
// app/layout.tsx
import { Noto_Sans_Tamil } from 'next/font/google'
const tamilFont = Noto_Sans_Tamil({ subsets: ['tamil'], weight: ['400', '600', '700'] })
```
The TipTap/Quill editor in the admin dashboard must also default to this font family.

**9. Admin Auth: Single Hardcoded Account (v1)**
For v1, there is only one admin account. It is hardcoded in `config.php`:
```php
define('ADMIN_EMAIL', 'admin@yourdomain.com');
define('ADMIN_PASSWORD_HASH', password_hash('your-strong-password', PASSWORD_BCRYPT));
```
Admin login at `api.yourdomain.com` issues a separate short-lived admin session cookie (not the same JWT as regular users). Do not mix admin and user auth systems.

**10. Mobile PDF Viewer: `<img>` Tags, Not Canvas**
On mobile viewports (screen width < 768px), the secure PDF viewer must render pages as `<img>` elements inside a locked container — not HTML5 Canvas.
```css
.pdf-page-container {
  user-select: none;
  -webkit-user-select: none;
  pointer-events: none; /* only on mobile */
}
```
Watermark is applied server-side by Imagick for all subscribed users regardless of device.
Canvas rendering is desktop-only.

**11. CORS + JWT Double Validation on `convert.php`**
Every request to `convert.php` must pass two checks before any file is served:
```
Check 1: HTTP Origin or Referer header must be https://yourdomain.com
          → If not → return 403 immediately

Check 2: JWT token (from Authorization: Bearer header or ?token= param)
          → Must be valid, unexpired, and belong to a real user
          → If user is not ACTIVE subscriber AND page > 2 → return 403
          → If user is ACTIVE subscriber → serve any page
```

---

### 🟢 Future Scope (Do Not Build Now)

**12. Reading Progress Tracking**
`reading_progress` table: `(user_id, doc_id, last_page, updated_at)`. Resume on re-open. Build after v1 launch.

**13. Full-Text Search**
MySQL `FULLTEXT` index on `title_tamil`, `author`, `description`. Build after content library grows.

**14. Analytics Beyond Revenue**
Track pages-per-session, drop-off point (paywall conversion rate), and traffic sources. Use a privacy-respecting tool (Plausible or self-hosted Umami). Build after v1 launch.

---

## 14. File Storage Reference

### Directory Layout on Hostinger

```
/home/{hostinger_user}/
├── public_html/                        ← api.yourdomain.com web root
│   ├── index.html                      # Admin dashboard (Next.js static export)
│   ├── _next/
│   └── api/
│       ├── config.php
│       ├── convert.php
│       ├── upload.php                  # Admin PDF upload handler
│       ├── razorpay-webhook.php
│       └── admin-auth.php
└── storage/                            ← NOT web-accessible (private)
    ├── pdfs/
    │   ├── doc_1.pdf
    │   ├── doc_2.pdf
    │   └── ...
    └── cache/
        ├── doc_1/
        │   ├── page_1.webp
        │   ├── page_2.webp
        │   └── ...
        └── doc_2/
            └── ...
```

> **Critical:** The `/storage/` directory must be outside `public_html`. PDFs must never be served as direct static files — always through `convert.php` which enforces auth and page limits.

### Admin PDF Upload Flow

```
Admin selects PDF in dashboard UI
         |
         v
POST multipart/form-data to api.yourdomain.com/api/upload.php
         |
         v
PHP validates: admin session, file type (PDF only), max size
         |
         v
PHP saves file to /home/{user}/storage/pdfs/{uuid}.pdf
         |
         v
PHP runs Imagick on page 1 → saves /storage/cache/{uuid}/page_1.webp (cover image)
         |
         v
PHP inserts row into content_metadata:
  file_path = 'pdfs/{uuid}.pdf'
  cover_image_url = '/api/convert.php?doc_id={uuid}&page=1'
  status = 'DRAFT'
         |
         v
Admin completes title, author, description fields → sets status to PUBLISHED
```

---

*Document version: 2.0 — All suggestions from v1.0 have been resolved and locked in as implementation rules. PDF storage changed from Google Drive to Hostinger local file system.*
