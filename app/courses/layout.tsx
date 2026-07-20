import type { Metadata } from "next";
import { getServerLocale, localizedPath } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const en = locale === "en";
  const path = localizedPath(locale, "/courses");
  const description = en
    ? "Browse Elmohager computer science and programming courses for secondary school students, including videos, PDF notes and practical exercises."
    : "تصفح كورسات الأستاذ محمود المهاجر في الحاسب الآلي والبرمجة للثانوية العامة، مع فيديوهات منظمة وملازم وتدريبات عملية.";
  return {
    title: en ? "Computer Science & Programming Courses" : "كورسات الحاسب الآلي والبرمجة للثانوية العامة",
    description,
    alternates: { canonical: path },
    openGraph: { title: en ? "Elmohager Courses" : "كورسات منصة المهاجر", description, url: path, locale: en ? "en_US" : "ar_EG" },
  };
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) { return children; }
