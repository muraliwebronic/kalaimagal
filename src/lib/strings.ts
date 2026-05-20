/**
 * Central TA/EN string dictionary.
 *
 * Why: keeping labels here (instead of inline) means future i18n is trivial,
 * and translators can review one file instead of grepping the codebase.
 */

export type Bilingual = { ta: string; en: string };

export const strings = {
  brand: {
    name: { ta: "கலைமகள்", en: "Kalaimagal" },
    tagline: {
      ta: "தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு",
      en: "The digital home of Tamil literature",
    },
  },
  nav: {
    home: { ta: "முகப்பு", en: "Home" },
    books: { ta: "புத்தகங்கள்", en: "Books" },
    articles: { ta: "கட்டுரைகள்", en: "Articles" },
    authors: { ta: "ஆசிரியர்கள்", en: "Authors" },
    about: { ta: "எங்களைப் பற்றி", en: "About" },
    account: { ta: "என் கணக்கு", en: "My Account" },
    login: { ta: "உள்நுழைய", en: "Login" },
    register: { ta: "பதிவு செய்க", en: "Register" },
    logout: { ta: "வெளியேறு", en: "Logout" },
    search: { ta: "தேடு", en: "Search" },
  },
  cta: {
    subscribe: { ta: "சந்தா செலுத்து", en: "Subscribe" },
    readMore: { ta: "மேலும் படிக்க", en: "Read more" },
    startReading: { ta: "வாசிக்க தொடங்கு", en: "Start reading" },
    learnMore: { ta: "மேலும் தெரிந்து கொள்ள", en: "Learn more" },
    viewAll: { ta: "அனைத்தையும் காண", en: "View all" },
  },
  badge: {
    free: { ta: "இலவசம்", en: "Free" },
    premium: { ta: "முதன்மை", en: "Premium" },
    featured: { ta: "சிறப்பு", en: "Featured" },
  },
  sections: {
    featuredBooks: { ta: "சிறப்புப் புத்தகங்கள்", en: "Featured Books" },
    recentArticles: { ta: "சமீபத்திய கட்டுரைகள்", en: "Recent Articles" },
    allBooks: { ta: "அனைத்து புத்தகங்களும்", en: "All Books" },
    allArticles: { ta: "அனைத்து கட்டுரைகளும்", en: "All Articles" },
  },
  footer: {
    about: { ta: "எங்களைப் பற்றி", en: "About" },
    contact: { ta: "தொடர்பு", en: "Contact" },
    privacy: { ta: "தனியுரிமை", en: "Privacy" },
    terms: { ta: "விதிமுறைகள்", en: "Terms" },
    refunds: { ta: "திருப்பிச் செலுத்தல்", en: "Refunds" },
    follow: { ta: "எங்களைப் பின்தொடரவும்", en: "Follow us" },
    rights: {
      ta: "© {year} கலைமகள். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      en: "© {year} Kalaimagal. All rights reserved.",
    },
  },
} as const;
