"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faChevronDown, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/components/auth/AuthProvider";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import ThemeToggle from "@/components/theme/ThemeToggle";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "نظرة عامة", subtitle: "متابعة المنصة لحظة بلحظة" },
  "/admin/courses": { title: "إدارة الكورسات", subtitle: "إنشاء وتسعير ونشر الكورسات" },
  "/admin/lessons": { title: "الدروس والمحتوى", subtitle: "رفع الفيديوهات والملازم وإدارتها" },
  "/admin/students": { title: "الطلاب", subtitle: "الحسابات والاشتراكات والصلاحيات" },
  "/admin/payments": { title: "المدفوعات والتقارير", subtitle: "مراجعة العمليات وتصدير Excel" },
  "/admin/qrcodes": { title: "رموز QR", subtitle: "إنشاء وإيقاف روابط الوصول" },
  "/admin/password-resets": { title: "استعادة كلمات المرور", subtitle: "مراجعة طلبات استعادة حسابات الطلاب" },
  "/admin/settings": { title: "إعدادات المنصة", subtitle: "وسائل الدفع وبيانات التواصل" },
};

export default function AdminTopbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const normalizedPathname = pathname || "/";
  const current = titles[normalizedPathname] || titles["/admin"];

  return (
    <header className="sticky top-0 z-30 hidden h-[78px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:flex">
      <div>
        <h2 className="font-heading text-base font-black text-navy">{current.title}</h2>
        <p className="mt-1 text-[11px] font-bold text-slate-400">{current.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle compact /><LanguageSwitcher compact />
        <Link href="/admin/payments" title="المدفوعات المعلقة" className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-brand/30 hover:text-brand"><FontAwesomeIcon icon={faBell} className="h-4 w-4" /><span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" /></Link>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white py-1.5 pr-2 pl-3 text-right shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><FontAwesomeIcon icon={faUserShield} /></span><span className="hidden xl:block"><span className="block text-xs font-black text-navy">{user?.name || "مدير المنصة"}</span><span className="block text-[10px] text-slate-400">{user?.role === "instructor" ? "مدرس" : "مدير المنصة"}</span></span><FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 text-slate-400" /></div>
      </div>
    </header>
  );
}
