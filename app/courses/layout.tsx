import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كورسات الحاسب الآلي والبرمجة للثانوية العامة",
  description: "تصفح كورسات الأستاذ محمود المهاجر في الحاسب الآلي والبرمجة للثانوية العامة، مع فيديوهات منظمة وملازم وتدريبات عملية.",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "كورسات منصة المهاجر",
    description: "كورسات الحاسب الآلي والبرمجة للثانوية العامة مع الأستاذ محمود المهاجر.",
    url: "/courses",
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
