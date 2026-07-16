const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const siteConfig = {
  name: "المهاجر",
  fullName: "منصة المهاجر | الثواني الأخيرة",
  teacherName: "الأستاذ محمود المهاجر",
  shortDescription: "شرح ومراجعة الحاسب الآلي والبرمجة للثانوية العامة",
  description:
    "منصة المهاجر التعليمية لشرح ومراجعة الحاسب الآلي والبرمجة لطلاب الثانوية العامة في مصر، مع فيديوهات منظمة، ملازم PDF، تدريبات واشتراكات آمنة.",
  siteUrl: rawSiteUrl.replace(/\/$/, ""),
  locale: "ar_EG",
  phoneDisplay: "01110037311",
  phoneInternational: "201110037311",
  email: "info@elmohager-learning.com",
  location: "مصر",
  logo: "/brand/logo.jpg",
  cover: "/brand/cover.png",
  ogImage: "/brand/og-share.jpg",
  keywords: [
    "المهاجر",
    "محمود المهاجر",
    "الثواني الأخيرة",
    "حاسب آلي ثانوية عامة",
    "برمجة الثانوية العامة",
    "مراجعة الحاسب الآلي",
    "تعليم البرمجة للثانوية العامة",
    "منصة المهاجر التعليمية",
    "الحاسب الآلي والبرمجة",
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalizedPath}`;
}
