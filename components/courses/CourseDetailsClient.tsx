"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Clock, LoaderCircle, QrCode, ShieldCheck, Star, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LessonItem from "@/components/LessonItem";
import WhatsAppButton from "@/components/WhatsAppButton";
import StatusBadge from "@/components/StatusBadge";
import CourseReviews from "@/components/CourseReviews";
import { getCourseBySlug } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { Course, Lesson } from "@/lib/types";

type Unit = { id: string; title: string; sort_order: number };

export default function CourseDetailsClient({ slug }: { slug: string }) {
  const [data, setData] = useState<{ course: Course; units: Unit[]; lessons: Lesson[]; hasAccess: boolean; canReview: boolean } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    getCourseBySlug(slug).then(setData).catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر تحميل الكورس."));
  }, [slug]);

  if (error) return <div className="min-h-screen bg-bg"><Navbar /><div className="container-app py-24"><div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center font-bold text-rose-600">{error}</div></div><Footer /></div>;
  if (!data) return <div className="min-h-screen bg-bg"><Navbar /><div className="flex min-h-[65vh] items-center justify-center gap-3 text-sm font-bold text-slate-500"><LoaderCircle className="animate-spin text-brand" /> جاري تحميل الكورس...</div><Footer /></div>;

  const { course, units, lessons, hasAccess, canReview } = data;
  const comingSoon = course.status === "coming_soon";

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <section className="relative overflow-hidden bg-mesh-navy">
        <div className="absolute inset-0 bg-grid-lines bg-[size:40px_40px] opacity-[0.12]" />
        <div className="container-app relative z-10 grid gap-10 py-14 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs text-brand-light">{course.grade}</span>{comingSoon && <StatusBadge label="قريبًا" tone="warning" dot={false} />}{course.price === 0 && !comingSoon && <StatusBadge label="مجاني" tone="success" dot={false} />}</div>
            <h1 className="mt-3 text-balance font-heading text-3xl font-extrabold text-white md:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">{course.shortDescription}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-300"><span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-warning text-warning" /> {course.rating} <small className="text-slate-400">({course.reviewsCount || 0})</small></span><span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {formatNumber(course.studentsCount)} طالب</span><span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.lessonsCount} درس</span></div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-[28px] border border-white/10 shadow-2xl"><Image src={course.image} alt={course.title} fill priority sizes="(max-width: 1024px) 100vw, 620px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" /></div>
        </div>
      </section>

      <section className="container-app grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-7">
          <article className="card-surface p-6"><h2 className="font-heading text-xl font-black text-navy">عن الكورس</h2><p className="mt-3 leading-8 text-ink">{course.description}</p><div className="mt-5 flex flex-wrap gap-2">{course.tags.map((tag) => <span key={tag} className="rounded-full bg-brand/5 px-3 py-1 text-xs font-bold text-brand">{tag}</span>)}</div></article>
          {!comingSoon && <section><h2 className="mb-4 font-heading text-xl font-black text-navy">محتوى الكورس</h2><div className="space-y-6">{units.map((unit) => { const unitLessons = lessons.filter((lesson) => String(lesson.unitId) === String(unit.id)); return <div key={unit.id}><h3 className="mb-3 text-sm font-black text-brand">{unit.title}</h3><div className="space-y-2">{unitLessons.length ? unitLessons.map((lesson, index) => <LessonItem key={lesson.id} lesson={lesson} index={index + 1} isSubscribed={hasAccess} />) : <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-400">سيتم إضافة الدروس قريبًا.</div>}</div></div>; })}</div></section>}
          <CourseReviews courseId={course.id} canReview={canReview} />
        </main>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card-surface flex flex-col gap-5 p-6">
            <div className="flex items-baseline justify-between"><span className="font-heading text-3xl font-extrabold text-navy">{comingSoon ? "قريبًا" : formatPrice(course.price)}</span>{!comingSoon && course.price > 0 && <span className="text-xs text-ink">اشتراك لمرة واحدة</span>}</div>
            {comingSoon ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-bold text-amber-700">يتم تجهيز هذا الكورس وسيتم فتح الاشتراك قريبًا.</div> : hasAccess ? <Link href="/dashboard" className="rounded-xl bg-success py-3.5 text-center font-bold text-white">الكورس موجود في لوحتك</Link> : <Link href={`/checkout/${course.id}`} className="rounded-xl bg-brand py-3.5 text-center font-bold text-white shadow-card transition hover:brightness-110">{course.price === 0 ? "فعّل الكورس مجانًا" : "اشترك الآن"}</Link>}
            <WhatsAppButton message={`أرغب في الاستفسار عن كورس: ${course.title}`} />
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-ink"><p className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" /> وصول للمحتوى بعد التفعيل</p><p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" /> فيديوهات وملفات محمية</p><p className="flex items-center gap-2"><Award className="h-4 w-4 text-brand" /> تقدم محفوظ داخل حسابك</p></div>
            <div className="flex items-start gap-3 rounded-xl bg-brand/5 p-4"><QrCode className="mt-0.5 h-5 w-5 shrink-0 text-brand" /><p className="text-xs leading-relaxed text-ink">QR يفتح صفحة الكورس، لكن المشاهدة لا تعمل إلا بعد تسجيل الدخول ووجود اشتراك فعّال.</p></div>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}
