import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(url) });

async function main() {
  console.log("→ Seeding Kalaimagal database...");

  // ---- 1. Admin user (SUPER_ADMIN) ---------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "password@123";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Admin";
  const forceChange = (process.env.SEED_FORCE_PASSWORD_CHANGE ?? "true") === "true";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      emailVerifiedAt: new Date(),
      forcePasswordChangeOnNextLogin: forceChange,
      isActive: true,
      preferredLanguage: "TA",
      termsAcceptedAt: new Date(),
    },
  });
  console.log(`  ✔ admin user (${admin.email}) [id=${admin.id}]`);

  // ---- 2. Subscription plan (Monthly ₹99 / 30d) --------------------------
  const monthlyPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "monthly" },
    update: {
      priceInr: "99.00",
      durationDays: 30,
      isActive: true,
      isFeatured: true,
    },
    create: {
      slug: "monthly",
      nameTamil: "மாதாந்திர திட்டம்",
      nameEnglish: "Monthly Plan",
      descriptionTamil: "30 நாட்கள் முழுமையான அணுகல்",
      descriptionEnglish: "Full access for 30 days",
      priceInr: "99.00",
      durationDays: 30,
      features: [
        "அனைத்து புத்தகங்களுக்கும் வரம்பற்ற அணுகல்",
        "Unlimited access to all books",
        "Premium blog articles",
        "Mobile + desktop reader",
      ],
      isActive: true,
      isFeatured: true,
      sortOrder: 0,
    },
  });
  console.log(`  ✔ subscription plan: ${monthlyPlan.slug}`);

  // ---- 3. Categories -----------------------------------------------------
  const categories = [
    { slug: "ilakkiyam", nameTamil: "இலக்கியம்", nameEnglish: "Literature", sortOrder: 0 },
    { slug: "sirukathai", nameTamil: "சிறுகதை", nameEnglish: "Short Stories", sortOrder: 1 },
    { slug: "naaval", nameTamil: "நாவல்", nameEnglish: "Novels", sortOrder: 2 },
    { slug: "kavithai", nameTamil: "கவிதை", nameEnglish: "Poetry", sortOrder: 3 },
    { slug: "kattuirai", nameTamil: "கட்டுரை", nameEnglish: "Essays", sortOrder: 4 },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log(`  ✔ ${categories.length} categories`);

  // ---- 4. Tags -----------------------------------------------------------
  const tags = [
    { slug: "aarampam", nameTamil: "ஆரம்பநிலை", nameEnglish: "Beginner" },
    { slug: "meampatta", nameTamil: "மேம்பட்ட", nameEnglish: "Advanced" },
  ];
  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }
  console.log(`  ✔ ${tags.length} tags`);

  // ---- 5. Authors --------------------------------------------------------
  const author1 = await prisma.author.upsert({
    where: { slug: "bharathiyar" },
    update: {},
    create: {
      slug: "bharathiyar",
      nameTamil: "சுப்பிரமணிய பாரதியார்",
      nameEnglish: "Subramania Bharati",
      bioTamil: "தமிழ்நாட்டின் தேசிய கவிஞர். விடுதலை, பெண்கள் உரிமை, சாதி எதிர்ப்பு என பல சமூக சீர்திருத்தக் கருத்துகளை தனது படைப்புகளில் வெளிப்படுத்தினார்.",
      bioEnglish: "National Poet of Tamil Nadu. His works championed freedom, women's rights, and anti-caste reforms.",
      bornYear: 1882,
      diedYear: 1921,
      isFeatured: true,
      sortOrder: 0,
    },
  });

  const author2 = await prisma.author.upsert({
    where: { slug: "kalki" },
    update: {},
    create: {
      slug: "kalki",
      nameTamil: "கல்கி கிருஷ்ணமூர்த்தி",
      nameEnglish: "Kalki Krishnamurthy",
      bioTamil: "தமிழின் தலைசிறந்த புதின எழுத்தாளர். 'பொன்னியின் செல்வன்', 'சிவகாமியின் சபதம்' போன்ற வரலாற்று நாவல்களை எழுதினார்.",
      bioEnglish: "One of Tamil's greatest historical novelists, author of 'Ponniyin Selvan' and 'Sivagamiyin Sapatham'.",
      bornYear: 1899,
      diedYear: 1954,
      isFeatured: true,
      sortOrder: 1,
    },
  });
  console.log(`  ✔ 2 authors`);

  // ---- 6. Sample content -------------------------------------------------
  const ilakkiyam = await prisma.category.findUniqueOrThrow({ where: { slug: "ilakkiyam" } });
  const kavithai = await prisma.category.findUniqueOrThrow({ where: { slug: "kavithai" } });
  const naaval = await prisma.category.findUniqueOrThrow({ where: { slug: "naaval" } });
  const kattuirai = await prisma.category.findUniqueOrThrow({ where: { slug: "kattuirai" } });
  const aarampamTag = await prisma.tag.findUniqueOrThrow({ where: { slug: "aarampam" } });

  // Demo PDF file present in public/uploads/pdfs/ (user-supplied for dev).
  // Both PDF sample contents point at it so the viewer + paywall can be
  // exercised end-to-end before the admin upload flow exists.
  const DEMO_PDF_KEY = "pdfs/cf3077ca-f0f7-48c7-8909-162f52542a99.pdf";
  const DEMO_PDF_PAGES = 144;

  // 6a. Free PDF sample — all pages readable for everyone
  await prisma.content.upsert({
    where: { slug: "bharathi-padalgal-sample" },
    update: { filePath: DEMO_PDF_KEY, pageCount: DEMO_PDF_PAGES },
    create: {
      slug: "bharathi-padalgal-sample",
      type: "PDF",
      titleTamil: "பாரதியார் பாடல்கள் — மாதிரி",
      titleEnglish: "Bharathi Padalgal — Sample",
      description: "பாரதியாரின் தேர்ந்தெடுக்கப்பட்ட தேசபக்திப் பாடல்கள். Selected patriotic songs of Bharati.",
      language: "TA",
      filePath: DEMO_PDF_KEY,
      pageCount: DEMO_PDF_PAGES,
      isPremium: false,
      isFeatured: true,
      status: "PUBLISHED",
      publishedAt: new Date(),
      createdById: admin.id,
      contentAuthors: {
        create: [{ authorId: author1.id, role: "AUTHOR", sortOrder: 0 }],
      },
      contentCategories: {
        create: [{ categoryId: kavithai.id }, { categoryId: ilakkiyam.id }],
      },
      contentTags: {
        create: [{ tagId: aarampamTag.id }],
      },
    },
  });

  // 6b. Premium PDF sample — pages 1-2 free, rest gated by Subscription
  await prisma.content.upsert({
    where: { slug: "ponniyin-selvan-vol-1" },
    update: { filePath: DEMO_PDF_KEY, pageCount: DEMO_PDF_PAGES },
    create: {
      slug: "ponniyin-selvan-vol-1",
      type: "PDF",
      titleTamil: "பொன்னியின் செல்வன் — முதல் பாகம்",
      titleEnglish: "Ponniyin Selvan — Volume 1",
      description: "சோழ சாம்ராஜ்யத்தின் வரலாற்று நாவல். The historical epic of the Chola empire.",
      language: "TA",
      filePath: DEMO_PDF_KEY,
      pageCount: DEMO_PDF_PAGES,
      isPremium: true,
      isFeatured: true,
      status: "PUBLISHED",
      publishedAt: new Date(),
      createdById: admin.id,
      contentAuthors: {
        create: [{ authorId: author2.id, role: "AUTHOR", sortOrder: 0 }],
      },
      contentCategories: {
        create: [{ categoryId: naaval.id }, { categoryId: ilakkiyam.id }],
      },
    },
  });

  // 6c. Free blog sample
  await prisma.content.upsert({
    where: { slug: "tamil-ilakkiya-varalaru" },
    update: {},
    create: {
      slug: "tamil-ilakkiya-varalaru",
      type: "BLOG",
      titleTamil: "தமிழ் இலக்கிய வரலாறு — ஒரு பார்வை",
      titleEnglish: "A Look at the History of Tamil Literature",
      description: "சங்க காலத்திலிருந்து தற்கால இலக்கியம் வரை. From the Sangam era to modern literature.",
      excerpt: "தமிழ் இலக்கியத்தின் இரண்டாயிரம் ஆண்டு பயணம், சங்க காலத்திலிருந்து தற்கால இலக்கியம் வரை...",
      bodyText: "<p>தமிழ் இலக்கியம் இரண்டாயிரம் ஆண்டுகளுக்கும் மேலான தொடர்ச்சியான இலக்கிய மரபைக் கொண்டது. சங்க காலம் முதல் தற்கால இலக்கியம் வரை, ஒவ்வொரு காலகட்டமும் தனித்துவமான பங்களிப்பை வழங்கியுள்ளது.</p><p>This blog post traces the two-millennia journey of Tamil literature, from the Sangam era to contemporary writing.</p>",
      language: "BILINGUAL",
      readingTimeMinutes: 8,
      wordCount: 1200,
      isPremium: false,
      status: "PUBLISHED",
      publishedAt: new Date(),
      createdById: admin.id,
      contentCategories: {
        create: [{ categoryId: kattuirai.id }],
      },
    },
  });
  console.log(`  ✔ 3 sample contents (1 free PDF, 1 premium PDF, 1 free blog)`);

  // ---- 7. Demo coupon ----------------------------------------------------
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: "10.00",
      maxUses: 1000,
      perUserLimit: 1,
      validFrom: new Date(),
      validUntil: ninetyDaysFromNow,
      appliesTo: { plan_slugs: ["monthly"] },
      isActive: true,
      createdById: admin.id,
    },
  });
  console.log(`  ✔ demo coupon: WELCOME10`);

  // ---- 8. Settings (DB-editable from admin UI later) ---------------------
  const settings: Array<{ key: string; value: unknown; description?: string }> = [
    { key: "site.name", value: "Kalaimagal", description: "Site name (English)" },
    { key: "site.name_tamil", value: "கலைமகள்", description: "Site name (Tamil)" },
    { key: "site.tagline_tamil", value: "தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு", description: "Site tagline (Tamil)" },
    { key: "site.tagline_english", value: "The digital home of Tamil literature", description: "Site tagline (English)" },
    { key: "site.support_email", value: "support@kalaimagal.com", description: "Public support email address" },
    { key: "site.logo_url", value: null, description: "URL to site logo; null = use typographic logo" },
    { key: "site.accent_color", value: "#7A1F2B", description: "Primary accent color (burgundy)" },
    { key: "site.accent_color_alt", value: "#D97F2E", description: "Secondary accent color (saffron)" },
    {
      key: "site.social_links",
      value: { twitter: null, instagram: null, youtube: null, facebook: null },
      description: "Social media URLs",
    },
    {
      key: "site.hero_config",
      value: {
        headline_tamil: "தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு",
        headline_english: "The digital home of Tamil literature",
        cta_text_tamil: "சந்தா செலுத்து",
        cta_text_english: "Subscribe",
        featured_content_ids: [],
      },
      description: "Homepage hero configuration",
    },
    { key: "payment.current_price_inr", value: 99, description: "Display price (mirrors monthly plan)" },
    { key: "payment.currency", value: "INR", description: "Display currency" },
    { key: "legal.privacy_url", value: "/legal/privacy", description: "Privacy policy URL" },
    { key: "legal.terms_url", value: "/legal/terms", description: "Terms of service URL" },
    { key: "legal.refund_url", value: "/legal/refunds", description: "Refund policy URL" },
    { key: "feature.email_verify_required", value: false, description: "Hard-gate browsing on email verify (false = soft mode)" },
    { key: "feature.maintenance_mode", value: false, description: "Show maintenance page to all non-admin users" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      // Cast value to Prisma's InputJsonValue (covers null + JSON primitives)
      update: { value: s.value as never, description: s.description },
      create: { key: s.key, value: s.value as never, description: s.description },
    });
  }
  console.log(`  ✔ ${settings.length} settings`);

  console.log("✓ Seed complete.");
}

main()
  .catch((e) => {
    console.error("✗ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
