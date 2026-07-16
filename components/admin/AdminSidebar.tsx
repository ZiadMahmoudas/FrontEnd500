"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBookOpen, faChartPie, faCirclePlay, faCode, faComments, faGear, faQrcode, faRightFromBracket, faUsers, faWallet } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/admin", label: "نظرة عامة", icon: faChartPie },
  { href: "/admin/courses", label: "الكورسات", icon: faBookOpen },
  { href: "/admin/lessons", label: "الدروس والمحتوى", icon: faCirclePlay },
  { href: "/admin/students", label: "الطلاب", icon: faUsers },
  { href: "/admin/payments", label: "المدفوعات والتقارير", icon: faWallet },
  { href: "/admin/reviews", label: "تقييمات الطلاب", icon: faComments },
  { href: "/admin/qrcodes", label: "رموز QR", icon: faQrcode },
  { href: "/admin/settings", label: "إعدادات المنصة", icon: faGear },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-[292px] shrink-0 flex-col overflow-hidden border-l border-white/10 bg-[#07111f] lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,.26),transparent_32%),radial-gradient(circle_at_90%_70%,rgba(34,211,238,.12),transparent_30%)]" />
      <div className="relative flex h-full flex-col p-5">
        <Link href="/" className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-cyan-400 text-white shadow-[0_12px_30px_rgba(37,99,235,.35)]"><FontAwesomeIcon icon={faCode} className="h-5 w-5" /></span><div><span className="block font-heading text-lg font-black text-white">كود<span className="text-cyan-300">باث</span></span><span className="text-[11px] text-slate-400">مركز إدارة المنصة</span></div></Link>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">القائمة الرئيسية</p>
        <nav className="flex flex-1 flex-col gap-1.5">{navItems.map((item) => { const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={cn("group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition", active ? "bg-gradient-to-l from-brand to-blue-500 text-white shadow-[0_12px_28px_rgba(37,99,235,.24)]" : "text-slate-400 hover:bg-white/[0.06] hover:text-white")}><FontAwesomeIcon icon={item.icon} className={cn("h-4 w-4", active ? "text-white" : "text-slate-500 group-hover:text-cyan-300")} /><span>{item.label}</span></Link>; })}</nav>
        <div className="space-y-2 border-t border-white/10 pt-4"><Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"><FontAwesomeIcon icon={faArrowRightFromBracket} className="h-4 w-4" /> العودة للموقع</Link><button onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-300 transition hover:bg-rose-500/10"><FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" /> تسجيل الخروج</button></div>
      </div>
    </aside>
  );
}
