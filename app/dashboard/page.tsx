"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBookOpen,
  faCheck,
  faCirclePlay,
  faClock,
  faCode,
  faFilePdf,
  faGraduationCap,
  faHouse,
  faPlay,
  faReceipt,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import BrandIcon from "@/components/ui/BrandIcon";
import RoleGuard from "@/components/auth/RoleGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { getStudentDashboard, type StudentDashboardData } from "@/lib/api/student";
import { getMyPayments, type MyPayment } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils";

const links = [
  [faHouse, "نظرة عامة", "#overview"],
  [faBookOpen, "كورساتي", "#courses"],
  [faCirclePlay, "متابعة المشاهدة", "#continue"],
  [faWallet, "المدفوعات", "#payments"],
  [faUser, "الحساب", "#profile"],
] as const;

const methodLabels: Record<MyPayment["method"], string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "InstaPay",
  paypal: "PayPal",
  whatsapp: "واتساب",
  manual: "تفعيل يدوي",
  free: "اشتراك مجاني",
};

const statusLabels: Record<MyPayment["status"], string> = {
  pending: "قيد المراجعة",
  approved: "مفعل",
  rejected: "مرفوض",
  failed: "فشل",
  cancelled: "ملغي",
  refunded: "مسترد",
};

function paymentTone(status: MyPayment["status"]): "success" | "warning" | "danger" | "neutral" {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  if (status === "rejected" || status === "failed" || status === "refunded") return "danger";
  return "neutral";
}

export default function DashboardPage() {
  return <RoleGuard roles={["student"]}><StudentDashboard /></RoleGuard>;
}

function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [payments, setPayments] = useState<MyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getStudentDashboard(), getMyPayments()])
      .then(([dashboard, paymentData]) => { setData(dashboard); setPayments(paymentData.payments); })
      .catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر تحميل لوحة الطالب."))
      .finally(() => setLoading(false));
  }, []);

  const averageProgress = useMemo(() => {
    if (!data?.courses.length) return 0;
    return Math.round(data.courses.reduce((sum, course) => sum + Number(course.progress), 0) / data.courses.length);
  }, [data]);

  const watchedHours = Math.round((Number(data?.stats.watched_seconds ?? 0) / 3600) * 10) / 10;

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <Navbar />
      <section className="container-app py-8 md:py-10">
        {loading ? <div className="rounded-3xl bg-white p-12 text-center text-sm font-bold text-slate-400">جاري تجهيز لوحة الطالب...</div> : error || !data ? <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-600">{error || "تعذر تحميل البيانات."}</div> : (
          <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="h-fit rounded-[28px] bg-[#07111f] p-4 text-white shadow-[0_22px_60px_rgba(15,23,42,.14)] lg:sticky lg:top-24">
              <div id="profile" className="flex items-center gap-3 border-b border-white/10 p-2 pb-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-cyan-400 text-lg font-black">{(user?.name || "ط").slice(0, 1)}</span>
                <div className="min-w-0"><p className="truncate text-sm font-black">{user?.name}</p><p className="mt-1 text-[10px] text-slate-400">{user?.grade || "طالب"}</p></div>
              </div>
              <nav className="mt-4 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">{links.map(([icon, label, href], index) => <Link key={label} href={href} className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-xs font-black transition ${index === 0 ? "bg-brand text-white" : "text-slate-400 hover:bg-white/[.06] hover:text-white"}`}><FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />{label}</Link>)}</nav>
              <div className="mt-5 hidden rounded-2xl border border-cyan-300/10 bg-cyan-300/[.06] p-4 lg:block"><FontAwesomeIcon icon={faGraduationCap} className="text-cyan-300" /><p className="mt-3 text-xs font-black">حسابك محمي</p><p className="mt-1 text-[10px] leading-5 text-slate-400">الكورسات لا تفتح إلا للاشتراكات المسجلة على حسابك.</p></div>
            </aside>

            <main className="min-w-0 space-y-6">
              <section id="overview" className="relative overflow-hidden rounded-[30px] bg-gradient-to-l from-brand to-blue-700 p-6 text-white shadow-[0_24px_60px_rgba(37,99,235,.24)] md:p-8">
                <div className="absolute inset-0 bg-grid-lines bg-[size:38px_38px] opacity-10" /><div className="absolute -left-8 -top-14 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2 text-xs font-black text-blue-100"><FontAwesomeIcon icon={faCode} className="text-cyan-300" />رحلة تعلمك محفوظة على حسابك</div><h1 className="mt-3 font-heading text-2xl font-black md:text-3xl">أهلًا يا {user?.name} 👋</h1><p className="mt-2 max-w-xl text-sm leading-7 text-blue-100">هنا هتلاقي كورساتك المفعلة، تقدم المشاهدة، وكل طلبات الدفع بأكوادها وحالتها.</p><Link href={data.courses[0] ? `/courses/${data.courses[0].slug}` : "/courses"} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-brand shadow-lg">{data.courses[0] ? "كمّل التعلم" : "اختار أول كورس"}<FontAwesomeIcon icon={faArrowLeft} /></Link></div><div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-[10px] border-white/15 bg-white/10 backdrop-blur"><div className="text-center"><strong className="font-heading text-3xl font-black">{averageProgress}%</strong><span className="block text-[10px] text-blue-100">متوسط التقدم</span></div></div></div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
                [faBookOpen, "كورساتي", String(data.stats.courses_count || 0), "اشتراك نشط", "brand"],
                [faCheck, "دروس مكتملة", String(data.stats.completed_lessons || 0), "محفوظة في حسابك", "success"],
                [faClock, "وقت المشاهدة", `${watchedHours}س`, "إجمالي التعلم", "warning"],
                [faReceipt, "طلبات الدفع", String(payments.length), "كل العمليات", "navy"],
              ].map(([icon, label, value, hint, tone]) => <article key={String(label)} className="rounded-[24px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)]"><BrandIcon icon={icon as any} tone={tone as any} /><p className="mt-4 text-xs font-bold text-slate-400">{String(label)}</p><div className="mt-1 flex items-end justify-between"><strong className="font-heading text-2xl font-black text-navy">{String(value)}</strong><span className="text-[10px] font-bold text-slate-400">{String(hint)}</span></div></article>)}</section>

              <section id="courses" className="rounded-[28px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)] md:p-6">
                <div className="mb-5 flex items-end justify-between"><div><h2 className="font-heading text-xl font-black text-navy">كورساتي المفعلة</h2><p className="mt-1 text-xs text-slate-400">تظهر هنا بعد الدفع أو الاشتراك المجاني.</p></div><Link href="/courses" className="text-xs font-black text-brand">كل الكورسات</Link></div>
                {data.courses.length ? <div className="space-y-3">{data.courses.map((course) => <Link key={course.id} href={`/courses/${course.slug}`} className="group grid gap-4 rounded-2xl border border-slate-100 p-3 transition hover:border-brand/20 hover:bg-brand/[.02] sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center"><div className="relative h-24 overflow-hidden rounded-2xl"><Image src={course.image_url || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80"} alt={course.title} fill sizes="120px" className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-black text-brand">{course.grade}</span><StatusBadge label="مفعل" tone="success" /></div><h3 className="mt-2 truncate text-sm font-black text-navy">{course.title}</h3><div className="mt-3 max-w-lg"><ProgressBar value={Math.round(Number(course.progress))} /></div></div><div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end"><span className="text-xs font-black text-navy">{Math.round(Number(course.progress))}%</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white transition group-hover:bg-brand"><FontAwesomeIcon icon={faPlay} className="h-3 w-3" /></span></div></Link>)}</div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center"><FontAwesomeIcon icon={faBookOpen} className="text-3xl text-slate-300" /><h3 className="mt-3 font-heading font-black text-navy">لسه مفيش كورس مفعل</h3><p className="mt-2 text-xs text-slate-400">ابدأ بالكورس المجاني لاختبار المنصة، أو اشترك في الكورس المدفوع.</p><Link href="/courses" className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2.5 text-xs font-black text-white">استعرض الكورسات</Link></div>}
              </section>

              <section id="continue" className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                <article className="rounded-[28px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)] md:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-heading text-xl font-black text-navy">تابع المشاهدة</h2><p className="mt-1 text-xs text-slate-400">آخر الدروس التي فتحتها.</p></div><FontAwesomeIcon icon={faCirclePlay} className="text-brand" /></div>{data.recent_lessons.length ? <div className="grid gap-4 sm:grid-cols-2">{data.recent_lessons.slice(0, 4).map((lesson) => <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="group overflow-hidden rounded-2xl border border-slate-100"><div className="relative aspect-video"><Image src={lesson.thumbnail_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80"} alt={lesson.title} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-navy/30" /><span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-xl"><FontAwesomeIcon icon={faPlay} className="h-3.5 w-3.5" /></span></div><div className="p-4"><p className="text-[10px] font-bold text-brand">{lesson.course_title}</p><h3 className="mt-1 truncate text-sm font-black text-navy">{lesson.title}</h3></div></Link>)}</div> : <p className="rounded-2xl bg-slate-50 p-8 text-center text-xs font-bold text-slate-400">ابدأ مشاهدة أي درس وسيظهر هنا تلقائيًا.</p>}</article>
                <aside className="rounded-[28px] bg-[#07111f] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.16)]"><FontAwesomeIcon icon={faFilePdf} className="text-2xl text-rose-300" /><h3 className="mt-4 font-heading text-lg font-black">الملازم المحمية</h3><p className="mt-2 text-xs leading-6 text-slate-400">ملفات الـPDF تفتح فقط بعد التأكد من اشتراكك، بنفس نظام حماية الفيديو.</p><div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-300">لا يتم وضع رابط الملف المباشر داخل الصفحة. السيرفر يصدر رابطًا مؤقتًا بعد فحص صلاحية حسابك.</div></aside>
              </section>

              <section id="payments" className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_10px_35px_rgba(15,23,42,.05)]"><div className="flex items-center justify-between border-b border-slate-100 p-5 md:p-6"><div><h2 className="font-heading text-xl font-black text-navy">طلبات الدفع والاشتراك</h2><p className="mt-1 text-xs text-slate-400">احتفظ بكود الطلب لمتابعة أي تحويل مع الدعم.</p></div><FontAwesomeIcon icon={faWallet} className="text-brand" /></div><div className="divide-y divide-slate-100">{payments.length ? payments.map((payment) => <div key={payment.id} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:px-6"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black text-navy">{payment.course_title}</p><StatusBadge label={statusLabels[payment.status]} tone={paymentTone(payment.status)} /></div><p className="mt-2 font-mono text-[10px] text-slate-400">{payment.order_code} • {methodLabels[payment.method]}{payment.transaction_id ? ` • ${payment.transaction_id}` : ""}</p>{payment.failure_reason && <p className="mt-2 text-[10px] font-bold text-rose-500">{payment.failure_reason}</p>}</div><strong className="text-sm text-navy">{formatPrice(Number(payment.course_price_egp))}</strong><span className="text-[10px] text-slate-400">{new Date(payment.created_at).toLocaleDateString("ar-EG")}</span></div>) : <div className="p-10 text-center text-xs font-bold text-slate-400">لا توجد طلبات دفع حتى الآن.</div>}</div></section>
            </main>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
