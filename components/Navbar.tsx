"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCode, faGaugeHigh, faGraduationCap, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import MobileMenu from "./MobileMenu";
import { useAuth } from "./auth/AuthProvider";

const publicLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/courses", label: "الكورسات" },
  { href: "/#faq", label: "الأسئلة الشائعة" },
];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const privateLink = user?.role === "student"
    ? { href: "/dashboard", label: "لوحتي", icon: faGraduationCap }
    : user
      ? { href: "/admin", label: "لوحة الإدارة", icon: faGaugeHigh }
      : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container-app flex h-[74px] items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-cyan-400 text-white shadow-[0_10px_28px_rgba(37,99,235,.25)]">
            <FontAwesomeIcon icon={faCode} className="h-5 w-5" />
          </span>
          <div>
            <span className="block font-heading text-xl font-black leading-none text-navy">كود<span className="text-brand">باث</span></span>
            <span className="mt-1 block text-[9px] font-bold tracking-wide text-slate-400">اتعلم • طبّق • اتطور</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-xl px-4 py-2.5 text-sm font-black text-slate-500 transition hover:bg-slate-50 hover:text-brand">
              {link.label}
            </Link>
          ))}
          {privateLink && <Link href={privateLink.href} className="rounded-xl px-4 py-2.5 text-sm font-black text-brand transition hover:bg-brand/5">{privateLink.label}</Link>}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? <span className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" /> : !user ? (
            <>
              <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-black text-navy transition hover:bg-slate-50">تسجيل الدخول</Link>
              <Link href="/register" className="group inline-flex items-center gap-2 rounded-2xl bg-navy px-5 py-3 text-xs font-black text-white shadow-[0_12px_28px_rgba(15,23,42,.18)] transition hover:-translate-y-0.5">
                ابدأ مجانًا <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3 transition group-hover:-translate-x-1" />
              </Link>
            </>
          ) : (
            <>
              <Link href={privateLink!.href} className="inline-flex items-center gap-2 rounded-2xl bg-navy px-4 py-3 text-xs font-black text-white shadow-sm">
                <FontAwesomeIcon icon={privateLink!.icon} /> {privateLink!.label}
              </Link>
              <span className="inline-flex max-w-[150px] items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2.5 text-xs font-black text-navy"><FontAwesomeIcon icon={faUser} className="text-brand" /><span className="truncate">{user.name}</span></span>
              <button onClick={signOut} title="تسجيل الخروج" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500">
                <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
