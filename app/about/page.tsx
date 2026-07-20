import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Code2, GraduationCap, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { getServerLocale, localizedPath } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const en = locale === "en";
  const path = localizedPath(locale, "/about");
  const title = en ? "Mr. Mahmoud Elmohager | Computer Science & Programming Teacher" : "الأستاذ محمود المهاجر | مدرس الحاسب الآلي والبرمجة";
  const description = en
    ? "Learn about Mr. Mahmoud Elmohager and The Final Seconds platform for teaching, revision and practical programming for secondary school students."
    : "تعرف على الأستاذ محمود المهاجر ومنصة الثواني الأخيرة لشرح وتأسيس ومراجعة الحاسب الآلي والبرمجة لطلاب الثانوية العامة.";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: en ? "Mr. Mahmoud Elmohager | The Final Seconds" : "الأستاذ محمود المهاجر | الثواني الأخيرة", description, url: path, images: [siteConfig.ogImage], locale: en ? "en_US" : "ar_EG" },
  };
}

export default async function AboutPage() {
  const locale = await getServerLocale();
  const en = locale === "en";
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: en ? "Mr. Mahmoud Elmohager" : siteConfig.teacherName,
        jobTitle: en ? "Computer Science and Programming Teacher" : "مدرس الحاسب الآلي والبرمجة",
        description: en ? "Teaching computer science and programming to secondary school students through organized lessons and practical applications." : "متخصص في شرح وتأسيس ومراجعة الحاسب الآلي والبرمجة لطلاب الثانوية العامة.",
        url: absoluteUrl(localizedPath(locale, "/about")),
        image: absoluteUrl(siteConfig.cover),
        telephone: `+${siteConfig.phoneInternational}`,
        worksFor: { "@type": "EducationalOrganization", name: en ? "Elmohager | The Final Seconds" : siteConfig.fullName, url: siteConfig.siteUrl },
      }} />

      <section className="bg-[#020713] px-3 py-5">
        <div className="container-app overflow-hidden rounded-[28px] border border-blue-400/20 shadow-2xl">
          <Image src="/brand/cover.png" alt={en ? "Mr. Mahmoud Elmohager" : "الأستاذ محمود المهاجر"} width={1366} height={288} priority className="h-auto w-full" />
        </div>
      </section>

      <section className="container-app grid gap-10 py-16 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
        <div className="mx-auto w-full max-w-sm rounded-[34px] border border-amber-200/40 bg-[#020713] p-5 shadow-[0_30px_80px_rgba(4,20,48,.2)]">
          <Image src="/brand/logo.jpg" alt={en ? "Elmohager The Final Seconds logo" : "شعار المهاجر الثواني الأخيرة"} width={600} height={600} className="h-auto w-full rounded-[26px]" />
        </div>
        <div>
          <span className="text-sm font-black text-brand">{en ? "Who is Mr. Mahmoud Elmohager?" : "من هو الأستاذ محمود المهاجر؟"}</span>
          <h1 className="mt-3 font-heading text-4xl font-black leading-[1.35] text-navy">{en ? "Clear explanations, strong foundations and revision that builds exam confidence." : "شرح مبسط، تأسيس قوي، ومراجعة تعرفك تدخل الامتحان بثقة."}</h1>
          <p className="mt-6 text-base leading-9 text-slate-600">
            {en ? "Elmohager — The Final Seconds is built for secondary school students who want to understand computer science and programming in an organized and practical way. It combines step-by-step videos, coding practice, PDF notes and final revision." : "منصة المهاجر — الثواني الأخيرة مخصصة لطلاب الثانوية العامة الراغبين في فهم مادة الحاسب الآلي والبرمجة بصورة منظمة وعملية. المحتوى يجمع بين الشرح خطوة بخطوة، التطبيق على الأكواد، الملازم والمراجعات النهائية."}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {(en ? [
              [GraduationCap, "Secondary-school focused lessons"],
              [Code2, "Practical programming exercises"],
              [BookOpen, "Organized notes and revision"],
              [CheckCircle2, "Student progress tracking"],
            ] : [
              [GraduationCap, "شرح مناسب للثانوية العامة"],
              [Code2, "تطبيق عملي على البرمجة"],
              [BookOpen, "ملازم ومراجعات منظمة"],
              [CheckCircle2, "متابعة تقدم الطالب"],
            ]).map(([Icon, text]) => (
              <div key={text as string} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-navy shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon className="h-5 w-5" /></span>{text as string}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={localizedPath(locale, "/courses")} className="rounded-2xl bg-navy px-6 py-4 text-center text-sm font-black text-white">{en ? "Browse courses" : "تصفح الكورسات"}</Link>
            <a href={`https://wa.me/${siteConfig.phoneInternational}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-white"><MessageCircle className="h-5 w-5" /> {en ? "Contact the platform" : "تواصل مع المنصة"}</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
