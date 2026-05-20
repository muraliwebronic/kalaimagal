/**
 * Admin UI dictionary. English-first (admins are typically internal staff)
 * with Tamil equivalents available via the LangToggle.
 *
 * Pick a string with `t(strings.xxx, lang)`.
 */

import type { AdminLang } from "@/lib/admin/lang";

type Bi = { en: string; ta: string };

export function t(entry: Bi, lang: AdminLang): string {
  return entry[lang];
}

export const adminStrings = {
  brand: {
    title: { en: "Kalaimagal Admin", ta: "கலைமகள் — நிர்வாகம்" },
  },
  nav: {
    dashboard: { en: "Dashboard", ta: "டாஷ்போர்டு" },
    content: { en: "Content", ta: "உள்ளடக்கம்" },
    subscribers: { en: "Subscribers", ta: "சந்தாதாரர்கள்" },
    plans: { en: "Plans", ta: "திட்டங்கள்" },
    coupons: { en: "Coupons", ta: "தள்ளுபடிகள்" },
    settings: { en: "Settings", ta: "அமைப்புகள்" },
    backToSite: { en: "Back to site", ta: "தளத்திற்குத் திரும்பு" },
    logout: { en: "Logout", ta: "வெளியேறு" },
  },
  common: {
    save: { en: "Save", ta: "சேமி" },
    cancel: { en: "Cancel", ta: "ரத்து" },
    delete: { en: "Delete", ta: "நீக்கு" },
    edit: { en: "Edit", ta: "திருத்து" },
    create: { en: "Create", ta: "உருவாக்கு" },
    publish: { en: "Publish", ta: "வெளியிடு" },
    unpublish: { en: "Unpublish", ta: "வெளியிடாதே" },
    yes: { en: "Yes", ta: "ஆம்" },
    no: { en: "No", ta: "இல்லை" },
    loading: { en: "Loading…", ta: "ஏற்றப்படுகிறது…" },
    saved: { en: "Saved.", ta: "சேமிக்கப்பட்டது." },
    failed: { en: "Failed.", ta: "தோல்வி." },
    confirmDelete: {
      en: "Are you sure? This cannot be undone.",
      ta: "உறுதியா? இதை மீட்க முடியாது.",
    },
    back: { en: "Back", ta: "திரும்பு" },
    new: { en: "New", ta: "புதிய" },
    actions: { en: "Actions", ta: "செயல்கள்" },
    status: { en: "Status", ta: "நிலை" },
    name: { en: "Name", ta: "பெயர்" },
    email: { en: "Email", ta: "மின்னஞ்சல்" },
    phone: { en: "Phone", ta: "தொலைபேசி" },
    type: { en: "Type", ta: "வகை" },
    title: { en: "Title", ta: "தலைப்பு" },
    slug: { en: "Slug", ta: "ஸ்லக்" },
    description: { en: "Description", ta: "விவரம்" },
    price: { en: "Price", ta: "விலை" },
    expiry: { en: "Expiry", ta: "காலாவதி" },
    createdAt: { en: "Created", ta: "உருவாக்கப்பட்டது" },
  },
  dashboard: {
    title: { en: "Dashboard", ta: "டாஷ்போர்டு" },
    revenueMtd: { en: "Revenue (MTD)", ta: "வருமானம் (இம்மாதம்)" },
    activeSubs: { en: "Active subscribers", ta: "செயலில் உள்ள சந்தாதாரர்கள்" },
    totalUsers: { en: "Total users", ta: "மொத்த பயனர்கள்" },
    pdfsPublished: { en: "PDFs published", ta: "வெளியிடப்பட்ட PDFகள்" },
    blogsPublished: { en: "Articles published", ta: "வெளியிடப்பட்ட கட்டுரைகள்" },
    pendingPayments: { en: "Pending payments", ta: "நிலுவையில் உள்ள கட்டணங்கள்" },
    recentSignups: { en: "Recent signups", ta: "சமீபத்திய பதிவுகள்" },
    recentPayments: { en: "Recent payments", ta: "சமீபத்திய கட்டணங்கள்" },
  },
  content: {
    listTitle: { en: "Content", ta: "உள்ளடக்கம்" },
    newPdf: { en: "Upload PDF", ta: "PDF பதிவேற்று" },
    newBlog: { en: "New article", ta: "புதிய கட்டுரை" },
    fields: {
      titleTamil: { en: "Title (Tamil)", ta: "தலைப்பு (தமிழ்)" },
      titleEnglish: { en: "Title (English, optional)", ta: "தலைப்பு (ஆங்கிலம், விருப்பம்)" },
      slug: { en: "URL slug", ta: "URL ஸ்லக்" },
      author: { en: "Author", ta: "ஆசிரியர்" },
      categories: { en: "Categories", ta: "வகைகள்" },
      tags: { en: "Tags", ta: "குறிச்சொற்கள்" },
      description: { en: "Description", ta: "விவரம்" },
      excerpt: { en: "Excerpt (blog cards)", ta: "சுருக்கம்" },
      body: { en: "Body (HTML)", ta: "உள்ளடக்கம் (HTML)" },
      bodyHelp: {
        en: "Paste HTML or Markdown. Sanitized server-side before storage.",
        ta: "HTML அல்லது Markdown ஒட்டவும். சேமிப்பதற்கு முன் சுத்தம் செய்யப்படும்.",
      },
      isPremium: { en: "Premium (paywalled)", ta: "முதன்மை (கட்டணம்)" },
      isFeatured: { en: "Featured on homepage", ta: "முகப்பில் சிறப்பு" },
      readingTimeMinutes: { en: "Reading time (min)", ta: "வாசிக்கும் நேரம் (நிமிடம்)" },
      file: { en: "PDF file", ta: "PDF கோப்பு" },
      fileHelp: {
        en: "Max 50MB. Only PDF files. Cover auto-generated from page 1.",
        ta: "அதிகபட்சம் 50MB. PDF கோப்புகள் மட்டுமே. அட்டை பக்கம் 1 இலிருந்து தானாக உருவாக்கப்படும்.",
      },
    },
    statusBadge: {
      DRAFT: { en: "Draft", ta: "வரைவு" },
      PUBLISHED: { en: "Published", ta: "வெளியிட்டது" },
      SCHEDULED: { en: "Scheduled", ta: "திட்டமிடப்பட்டது" },
      ARCHIVED: { en: "Archived", ta: "காப்பகம்" },
    },
  },
  subscribers: {
    listTitle: { en: "Subscribers", ta: "சந்தாதாரர்கள்" },
    cols: {
      user: { en: "User", ta: "பயனர்" },
      role: { en: "Role", ta: "பங்கு" },
      subStatus: { en: "Subscription", ta: "சந்தா" },
      expiresAt: { en: "Expires", ta: "காலாவதி" },
      joined: { en: "Joined", ta: "இணைந்தது" },
      lastActive: { en: "Last active", ta: "கடைசி செயல்பாடு" },
    },
    actions: {
      extend30: { en: "Extend +30 days", ta: "+30 நாட்கள் நீட்டிக்கவும்" },
      ban: { en: "Ban", ta: "தடை" },
      unban: { en: "Unban", ta: "தடை நீக்கு" },
      resetPassword: { en: "Send password reset", ta: "கடவுச்சொல் மீட்பு அனுப்பு" },
    },
    noSubscription: { en: "No active subscription", ta: "செயலில் சந்தா இல்லை" },
  },
  plans: {
    listTitle: { en: "Plans", ta: "திட்டங்கள்" },
    fields: {
      slug: { en: "Slug", ta: "ஸ்லக்" },
      nameTamil: { en: "Name (Tamil)", ta: "பெயர் (தமிழ்)" },
      nameEnglish: { en: "Name (English)", ta: "பெயர் (ஆங்கிலம்)" },
      priceInr: { en: "Price (INR)", ta: "விலை (INR)" },
      durationDays: { en: "Duration (days)", ta: "காலம் (நாட்கள்)" },
      isActive: { en: "Active", ta: "செயலில்" },
      isFeatured: { en: "Featured on homepage", ta: "முகப்பில் சிறப்பு" },
    },
  },
  coupons: {
    listTitle: { en: "Coupons", ta: "தள்ளுபடிகள்" },
    fields: {
      code: { en: "Code", ta: "குறியீடு" },
      type: { en: "Type", ta: "வகை" },
      value: { en: "Value", ta: "மதிப்பு" },
      maxUses: { en: "Max uses", ta: "அதிகபட்ச பயன்பாடு" },
      usedCount: { en: "Used", ta: "பயன்படுத்தப்பட்டது" },
      validUntil: { en: "Valid until", ta: "செல்லுபடியாகும் வரை" },
      isActive: { en: "Active", ta: "செயலில்" },
    },
  },
  settings: {
    listTitle: { en: "Settings", ta: "அமைப்புகள்" },
    help: {
      en: "Runtime configuration. Values are stored as JSON. Update with care — changes take effect immediately.",
      ta: "இயக்க கட்டமைப்பு. மதிப்புகள் JSON ஆக சேமிக்கப்படுகின்றன. கவனமாக புதுப்பிக்கவும் — மாற்றங்கள் உடனடியாக நடைமுறைக்கு வரும்.",
    },
  },
  login: {
    title: { en: "Admin sign in", ta: "நிர்வாக உள்நுழைவு" },
    subtitle: { en: "Authorized personnel only", ta: "அங்கீகரிக்கப்பட்ட நபர்களுக்கு மட்டுமே" },
    notAdmin: {
      en: "This account does not have admin access.",
      ta: "இந்த கணக்கில் நிர்வாக அணுகல் இல்லை.",
    },
  },
} as const;
