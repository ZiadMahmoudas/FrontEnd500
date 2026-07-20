"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faBookOpen,
  faGaugeHigh,
  faGraduationCap,
  faHouse,
  faInfoCircle,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import BrandLogo from "./BrandLogo";
import { useAuth } from "./auth/AuthProvider";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useLanguage } from "./i18n/LanguageProvider";
import ThemeToggle from "./theme/ThemeToggle";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const normalizedPathname = pathname || "/";
  const { user, signOut } = useAuth();
  const { isEnglish } = useLanguage();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201110037311";

  const copy = isEnglish ? {
    open: "Open menu", close: "Close menu", nav: "Navigation menu",
    home: "Home", courses: "Courses", about: "About the Teacher",
    student: "Student Dashboard", admin: "Admin Dashboard", login: "Sign In",
    register: "Create Account", logout: "Sign Out", support: "WhatsApp Support",
    free: "Create Free Account", brand: "Elmohager", subtitle: "The Final Seconds",
    studentRole: "Student Account", adminRole: "Management Account",
  } : {
    open: "فتح القائمة", close: "إغلاق القائمة", nav: "قائمة التنقل",
    home: "الرئيسية", courses: "الكورسات", about: "عن الأستاذ",
    student: "لوحة الطالب", admin: "لوحة الإدارة", login: "تسجيل الدخول",
    register: "إنشاء حساب", logout: "تسجيل الخروج", support: "تواصل عبر واتساب",
    free: "إنشاء حساب مجاني", brand: "المهاجر", subtitle: "الثواني الأخيرة",
    studentRole: "حساب طالب", adminRole: "حساب إدارة",
  };

  const links = useMemo(() => [
    { href: "/", label: copy.home, icon: faHouse },
    { href: "/courses", label: copy.courses, icon: faBookOpen },
    { href: "/about", label: copy.about, icon: faInfoCircle },
    ...(user?.role === "student" ? [{ href: "/dashboard", label: copy.student, icon: faGraduationCap }] : []),
    ...(user && user.role !== "student" ? [{ href: "/admin", label: copy.admin, icon: faGaugeHigh }] : []),
    ...(!user ? [
      { href: "/login", label: copy.login, icon: faRightToBracket },
      { href: "/register", label: copy.register, icon: faUserPlus },
    ] : []),
  ], [user, copy.home, copy.courses, copy.about, copy.student, copy.admin, copy.login, copy.register]);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function logout() {
    setOpen(false);
    await signOut();
  }

  return (
    <div className="lg:hidden" data-no-translate>
      <button
        type="button"
        aria-label={copy.open}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-navy shadow-sm transition active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
      </button>

      {mounted && createPortal(
        <div className={`fixed inset-0 z-[100] transition ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
          <button
            type="button"
            aria-label={copy.close}
            tabIndex={open ? 0 : -1}
            className={`absolute inset-0 bg-[#020713]/75 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
            onClick={() => setOpen(false)}
          />

          <aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={copy.nav}
            className={`absolute inset-y-0 flex w-[min(90vw,390px)] flex-col overflow-y-auto bg-white transition-transform duration-300 ease-out dark:bg-slate-950 ${isEnglish ? "left-0 shadow-[24px_0_70px_rgba(2,7,19,.35)]" : "right-0 shadow-[-24px_0_70px_rgba(2,7,19,.35)]"} ${open ? "translate-x-0" : isEnglish ? "-translate-x-full" : "translate-x-full"}`}
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))", paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 pb-5 dark:border-slate-800">
              <Link href="/" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3">
                <BrandLogo size={48} priority />
                <div className="min-w-0">
                  <span className="block truncate font-heading text-lg font-black text-navy dark:text-white">{copy.brand}</span>
                  <span className="block truncate text-[10px] font-bold text-amber-600">{copy.subtitle}</span>
                </div>
              </Link>
              <button type="button" aria-label={copy.close} onClick={() => setOpen(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-navy transition hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-white">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {user && (
              <Link href={user.role === "student" ? "/dashboard/account" : "/admin"} onClick={() => setOpen(false)} className="mx-5 mt-5 flex items-center gap-3 rounded-2xl border border-brand/10 bg-brand/5 p-4">
                {user.avatarUrl ? <Image src={user.avatarUrl} alt={user.name} width={44} height={44} className="h-11 w-11 rounded-2xl object-cover" unoptimized /> : <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-lg font-black text-white">{user.name.slice(0, 1)}</span>}
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-navy dark:text-white">{user.name}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{user.role === "student" ? user.grade || copy.studentRole : copy.adminRole}</p>
                </div>
              </Link>
            )}

            <nav className="mt-4 flex flex-col gap-1.5 px-4">
              {links.map((link) => {
                const active = link.href === "/" ? normalizedPathname === "/" : normalizedPathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-black transition ${active ? "border-brand/15 bg-brand/10 text-brand" : "border-transparent text-navy hover:border-brand/10 hover:bg-brand/5 hover:text-brand dark:text-slate-200"}`}>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-brand text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}><FontAwesomeIcon icon={link.icon} className="h-3.5 w-3.5" /></span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              {user && (
                <button type="button" onClick={logout} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/30">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30"><FontAwesomeIcon icon={faRightFromBracket} /></span>
                  {copy.logout}
                </button>
              )}
            </nav>

            <div className="mt-auto space-y-3 border-t border-slate-100 px-5 pt-5 dark:border-slate-800">
              <div className="flex items-center justify-center gap-2"><ThemeToggle /><LanguageSwitcher /></div>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3.5 text-sm font-black text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                <FontAwesomeIcon icon={faWhatsapp} /> {copy.support}
              </a>
              {!user && (
                <Link href="/register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl bg-navy py-3.5 text-sm font-black text-white dark:bg-brand">
                  {copy.free} <FontAwesomeIcon icon={isEnglish ? faArrowRight : faArrowLeft} />
                </Link>
              )}
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </div>
  );
}
