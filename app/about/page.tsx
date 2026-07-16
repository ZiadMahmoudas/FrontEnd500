import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Code2, GraduationCap, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "الأستاذ محمود المهاجر | مدرس الحاسب الآلي والبرمجة",
  description: "تعرف على الأستاذ محمود المهاجر ومنصة الثواني الأخيرة لشرح وتأسيس ومراجعة الحاسب الآلي والبرمجة لطلاب الثانوية العامة.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "الأستاذ محمود المهاجر | الثواني الأخيرة",
    description: "شرح وتأسيس ومراجعة الحاسب الآلي والبرمجة لطلاب الثانوية العامة.",
    url: "/about",
    images: [siteConfig.ogImage],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: siteConfig.teacherName,
        jobTitle: "مدرس الحاسب الآلي والبرمجة",
        description: "متخصص في شرح وتأسيس ومراجعة الحاسب الآلي والبرمجة لطلاب الثانوية العامة.",
        url: absoluteUrl("/about"),
        image: absoluteUrl(siteConfig.cover),
        telephone: `+${siteConfig.phoneInternational}`,
        worksFor: { "@type": "EducationalOrganization", name: siteConfig.fullName, url: siteConfig.siteUrl },
      }} />

      <section className="bg-[#020713] px-3 py-5">
        <div className="container-app overflow-hidden rounded-[28px] border border-blue-400/20 shadow-2xl">
          <Image src="/brand/cover.png" alt="الأستاذ محمود المهاجر" width={1366} height={288} priority className="h-auto w-full" />
        </div>
      </section>

      <section className="container-app grid gap-10 py-16 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
        <div className="mx-auto w-full max-w-sm rounded-[34px] border border-amber-200/40 bg-[#020713] p-5 shadow-[0_30px_80px_rgba(4,20,48,.2)]">
          <Image src="/brand/logo.jpg" alt="شعار المهاجر الثواني الأخيرة" width={600} height={600} className="h-auto w-full rounded-[26px]" />
        </div>
        <div>
          <span className="text-sm font-black text-brand">من هو الأستاذ محمود المهاجر؟</span>
          <h1 className="mt-3 font-heading text-4xl font-black leading-[1.35] text-navy">شرح مبسط، تأسيس قوي، ومراجعة تعرفك تدخل الامتحان بثقة.</h1>
          <p className="mt-6 text-base leading-9 text-slate-600">
            منصة المهاجر — الثواني الأخيرة مخصصة لطلاب الثانوية العامة الراغبين في فهم مادة الحاسب الآلي والبرمجة بصورة منظمة وعملية. المحتوى يجمع بين الشرح خطوة بخطوة، التطبيق على الأكواد، الملازم والمراجعات النهائية.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [GraduationCap, "شرح مناسب للثانوية العامة"],
              [Code2, "تطبيق عملي على البرمجة"],
              [BookOpen, "ملازم ومراجعات منظمة"],
              [CheckCircle2, "متابعة تقدم الطالب"],
            ].map(([Icon, text]) => (
              <div key={text as string} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-navy shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon className="h-5 w-5" /></span>{text as string}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="rounded-2xl bg-navy px-6 py-4 text-center text-sm font-black text-white">تصفح الكورسات</Link>
            <a href={`https://wa.me/${siteConfig.phoneInternational}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-white"><MessageCircle className="h-5 w-5" /> تواصل مع المنصة</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
