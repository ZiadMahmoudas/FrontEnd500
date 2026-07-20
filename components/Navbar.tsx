"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faGaugeHigh, faGraduationCap, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import MobileMenu from "./MobileMenu";
import BrandLogo from "./BrandLogo";
import { useAuth } from "./auth/AuthProvider";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useLanguage } from "./i18n/LanguageProvider";
import ThemeToggle from "./theme/ThemeToggle";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const { isEnglish } = useLanguage();
  const labels = isEnglish ? {
    home: "Home", courses: "Courses", about: "About the Teacher", faq: "FAQ",
    student: "My Dashboard", admin: "Admin Dashboard", login: "Sign In", start: "Create Account",
    logout: "Sign Out", brand: "Elmohager", subtitle: "The Final Seconds • Computer Science & Programming",
  } : {
    home: "الرئيسية", courses: "الكورسات", about: "عن الأستاذ", faq: "الأسئلة الشائعة",
    student: "لوحتي", admin: "لوحة الإدارة", login: "تسجيل الدخول", start: "إنشاء حساب",
    logout: "تسجيل الخروج", brand: "المهاجر", subtitle: "الثواني الأخيرة • حاسب آلي وبرمجة",
  };

  const publicLinks = [
    { href: "/", label: labels.home },
    { href: "/courses", label: labels.courses },
    { href: "/about", label: labels.about },
    { href: "/#faq", label: labels.faq },
  ];
  const privateLink = user?.role === "student"
    ? { href: "/dashboard", label: labels.student, icon: faGraduationCap }
    : user ? { href: "/admin", label: labels.admin, icon: faGaugeHigh } : null;
  const accountHref = user?.role === "student" ? "/dashboard/account" : "/admin";

  return (
    <header data-no-translate className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,.04)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/88">
      <div className="container-app flex h-[74px] items-center gap-3">
        <Link href="/" aria-label={labels.brand} className="flex min-w-0 shrink-0 items-center gap-2.5 xl:min-w-[255px]">
          <BrandLogo size={48} priority />
          <div className="hidden min-w-0 sm:block">
            <span className="block truncate font-heading text-lg font-black leading-none text-navy dark:text-white">{labels.brand}</span>
            <span className="mt-1 block max-w-[210px] truncate text-[8px] font-bold tracking-wide text-slate-400">{labels.subtitle}</span>
          </div>
        </Link>

        <nav className="mx-auto hidden items-center justify-center gap-1 lg:flex">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[13px] font-black text-slate-500 transition hover:bg-brand/5 hover:text-brand dark:text-slate-300 dark:hover:bg-white/5">
              {link.label}
            </Link>
          ))}
          {privateLink && (
            <Link href={privateLink.href} className="whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[13px] font-black text-brand transition hover:bg-brand/5">
              {privateLink.label}
            </Link>
          )}
        </nav>

        <div className="ms-auto hidden shrink-0 items-center gap-2 lg:flex">
          <ThemeToggle compact />
          <LanguageSwitcher compact />
          {loading ? <span className="h-10 w-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /> : !user ? (
            <>
              <Link href="/login" className="whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-black text-navy transition hover:bg-slate-50 dark:text-white dark:hover:bg-slate-800">{labels.login}</Link>
              <Link href="/register" className="group inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-navy px-4 py-3 text-xs font-black text-white shadow-[0_12px_28px_rgba(15,23,42,.18)] transition hover:-translate-y-0.5 dark:bg-brand">
                {labels.start}
                <FontAwesomeIcon icon={isEnglish ? faArrowRight : faArrowLeft} className="h-3 w-3" />
              </Link>
            </>
          ) : (
            <>
              <Link href={privateLink!.href} className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-navy px-3.5 py-2.5 text-xs font-black text-white shadow-sm dark:bg-brand">
                <FontAwesomeIcon icon={privateLink!.icon} /> {privateLink!.label}
              </Link>
              <Link href={accountHref} className="inline-flex max-w-[150px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-black text-navy transition hover:border-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name} width={30} height={30} className="h-7 w-7 rounded-xl object-cover" unoptimized />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand/10 text-brand"><FontAwesomeIcon icon={faUser} /></span>
                )}
                <span className="truncate">{user.name}</span>
              </Link>
              <button onClick={signOut} title={labels.logout} aria-label={labels.logout} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700 dark:hover:bg-rose-950/30">
                <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="ms-auto flex items-center gap-2 lg:hidden">
          <ThemeToggle compact />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
