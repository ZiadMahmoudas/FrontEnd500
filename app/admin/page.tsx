"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBookOpen,
  faCheck,
  faChartLine,
  faClock,
  faFileExcel,
  faPlus,
  faQrcode,
  faUsers,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import BrandIcon from "@/components/ui/BrandIcon";
import StatusBadge from "@/components/StatusBadge";
import { getAdminDashboard, type AdminDashboardData } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { PaymentMethod, PaymentStatus } from "@/lib/types";

const methods: Record<PaymentMethod, string> = { vodafone_cash: "فودافون كاش", instapay: "InstaPay", paypal: "PayPal", whatsapp: "واتساب", manual: "يدوي", free: "مجاني" };
const statuses: Record<PaymentStatus, string> = { pending: "مراجعة", approved: "مقبول", rejected: "مرفوض", failed: "فشل", cancelled: "ملغي", refunded: "مسترد" };

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(setData).catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر تحميل لوحة الإدارة.")).finally(() => setLoading(false));
  }, []);

  const maxActivity = useMemo(() => Math.max(1, ...(data?.weekly_activity.map((item) => Number(item.interactions)) ?? [1])), [data]);

  if (loading) return <div className="rounded-3xl bg-white p-10 text-center text-sm font-bold text-slate-400">جاري تحميل أرقام المنصة...</div>;
  if (!data) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-600">{error || "لا توجد بيانات متاحة."}</div>;

  const cards = [
    { label: "إجمالي الطلاب", value: formatNumber(data.stats.students), hint: "حساب طالب مسجل", icon: faUsers, tone: "brand" as const },
    { label: "اشتراكات نشطة", value: formatNumber(data.stats.active_subscriptions), hint: "يمكنهم فتح المحتوى", icon: faCheck, tone: "success" as const },
    { label: "مدفوعات معلقة", value: formatNumber(data.stats.pending_payments), hint: "تحتاج مراجعة", icon: faClock, tone: "warning" as const },
    { label: "الإيراد المحصل", value: formatPrice(Number(data.stats.revenue)), hint: "عمليات مقبولة فقط", icon: faWallet, tone: "navy" as const },
  ];

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-xs font-black text-brand">أهلًا، {user?.name || "مدير المنصة"}</p><h1 className="font-heading text-2xl font-black text-navy md:text-3xl">لوحة قيادة المنصة</h1><p className="mt-2 text-sm text-slate-500">أرقام حقيقية من قاعدة البيانات، وليست بيانات تجريبية داخل الواجهة.</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/admin/payments" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-navy"><FontAwesomeIcon icon={faFileExcel} className="text-emerald-600" /> المدفوعات وExcel</Link><Link href="/admin/lessons" className="inline-flex items-center gap-2 rounded-2xl bg-navy px-4 py-3 text-xs font-black text-white"><FontAwesomeIcon icon={faPlus} /> إضافة درس</Link></div>
      </section>

      {error && <div className="rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-600">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <article key={card.label} className="rounded-[24px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.06)]"><div className="flex items-start justify-between"><BrandIcon icon={card.icon} tone={card.tone} /><span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-400">Live</span></div><p className="mt-5 text-xs font-bold text-slate-500">{card.label}</p><strong className="mt-1 block font-heading text-2xl font-black text-navy">{card.value}</strong><p className="mt-2 text-[10px] font-bold text-slate-400">{card.hint}</p></article>)}</section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
        <article className="rounded-[28px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.06)] md:p-6">
          <div className="flex items-center justify-between"><div><div className="flex items-center gap-2"><BrandIcon icon={faChartLine} tone="brand" className="h-9 w-9 rounded-xl" /><h2 className="font-heading text-lg font-black text-navy">تفاعل آخر 7 أيام</h2></div><p className="mt-2 text-xs text-slate-400">مبني على تقدم مشاهدة الدروس المسجل.</p></div><span className="text-xs font-black text-brand">{data.weekly_activity.reduce((sum, item) => sum + Number(item.interactions), 0)} تفاعل</span></div>
          <div className="mt-8 flex h-56 items-end gap-3 rounded-2xl bg-slate-50 p-4">{data.weekly_activity.length ? data.weekly_activity.map((item) => <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-black text-brand">{item.interactions}</span><div className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-brand to-cyan-400 transition" style={{ height: `${Math.max(10, Number(item.interactions) / maxActivity * 100)}%` }} /><span className="text-[9px] text-slate-400">{new Date(item.day).toLocaleDateString("ar-EG", { weekday: "short" })}</span></div>) : <div className="m-auto text-center text-xs font-bold text-slate-400">يظهر الرسم بعد بدء الطلاب في مشاهدة الدروس.</div>}</div>
        </article>

        <aside className="rounded-[28px] bg-[#07111f] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,.18)]"><FontAwesomeIcon icon={faQrcode} className="text-3xl text-cyan-300" /><h2 className="mt-5 font-heading text-xl font-black">إجراءات سريعة</h2><p className="mt-2 text-xs leading-6 text-slate-400">اختصارات لأكثر العمليات استخدامًا.</p><div className="mt-6 space-y-3"><Link href="/admin/payments" className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-xs font-black hover:bg-white/10"><span>مراجعة المدفوعات</span><b className="rounded-full bg-amber-400 px-2 py-1 text-[10px] text-navy">{data.stats.pending_payments}</b></Link><Link href="/admin/courses" className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-xs font-black hover:bg-white/10"><span>إدارة الكورسات</span><FontAwesomeIcon icon={faBookOpen} className="text-cyan-300" /></Link><Link href="/admin/qrcodes" className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-xs font-black hover:bg-white/10"><span>توليد QR Code</span><FontAwesomeIcon icon={faArrowLeft} /></Link></div></aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <article className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_10px_35px_rgba(15,23,42,.05)]"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-heading text-lg font-black text-navy">أحدث عمليات الدفع</h2><p className="mt-1 text-xs text-slate-400">آخر طلبات مسجلة من وسائل الدفع المختلفة.</p></div><Link href="/admin/payments" className="text-xs font-black text-brand">عرض الكل</Link></div><div className="divide-y divide-slate-100">{data.recent_payments.length ? data.recent_payments.map((payment) => <div key={payment.id} className="flex flex-wrap items-center gap-3 p-4"><div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-navy">{payment.student_name} — {payment.course_title}</p><p className="mt-1 text-[10px] text-slate-400">{methods[payment.method]} • {payment.order_code}</p></div><strong className="text-xs text-navy">{formatPrice(Number(payment.course_price_egp))}</strong><StatusBadge label={statuses[payment.status]} tone={payment.status === "approved" ? "success" : payment.status === "pending" ? "warning" : "danger"} /></div>) : <p className="p-8 text-center text-xs font-bold text-slate-400">لا توجد مدفوعات بعد.</p>}</div></article>
        <article className="rounded-[28px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)]"><div className="flex items-center justify-between"><div><h2 className="font-heading text-lg font-black text-navy">أحدث الطلاب</h2><p className="mt-1 text-xs text-slate-400">آخر الحسابات المسجلة.</p></div><BrandIcon icon={faUsers} tone="brand" className="h-9 w-9 rounded-xl" /></div><div className="mt-4 space-y-3">{data.recent_students.slice(0, 6).map((student) => <div key={student.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-xs font-black text-brand">{student.name.slice(0, 1)}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-navy">{student.name}</p><p className="mt-1 font-mono text-[10px] text-slate-400">{student.phone}</p></div><StatusBadge label={student.status === "active" ? "نشط" : "موقوف"} tone={student.status === "active" ? "success" : "danger"} /></div>)}</div></article>
      </section>
    </div>
  );
}
