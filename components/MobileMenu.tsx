"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
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

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const normalizedPathname = pathname || "/";
  const { user, signOut } = useAuth();
  const { isEnglish } = useLanguage();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201110037311";

  const links = useMemo(() => [
    { href: "/", label: "الرئيسية", icon: faHouse },
    { href: "/courses", label: "الكورسات", icon: faBookOpen },
    { href: "/about", label: "عن الأستاذ", icon: faInfoCircle },
    ...(user?.role === "student"
      ? [{ href: "/dashboard", label: "لوحة الطالب", icon: faGraduationCap }]
      : []),
    ...(user && user.role !== "student"
      ? [{ href: "/admin", label: "لوحة الإدارة", icon: faGaugeHigh }]
      : []),
    ...(!user
      ? [
          { href: "/login", label: "تسجيل الدخول", icon: faRightToBracket },
          { href: "/register", label: "إنشاء حساب", icon: faUserPlus },
        ]
      : []),
  ], [user]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
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
    <div className="md:hidden">
      <button
        type="button"
        aria-label="فتح القائمة"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-navy shadow-sm transition active:scale-95"
      >
        <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
      </button>

{mounted && createPortal(
        <div
        className={`fixed inset-0 z-[100] transition ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="إغلاق القائمة"
          tabIndex={open ? 0 : -1}
          className={`absolute inset-0 bg-[#020713]/72 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        <aside
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="قائمة التنقل"
          className={`absolute inset-y-0 flex w-[min(90vw,390px)] flex-col overflow-y-auto bg-white transition-transform duration-300 ease-out ${isEnglish ? "left-0 shadow-[24px_0_70px_rgba(2,7,19,.28)]" : "right-0 shadow-[-24px_0_70px_rgba(2,7,19,.28)]"} ${open ? "translate-x-0" : isEnglish ? "-translate-x-full" : "translate-x-full"}`}
          style={{ paddingTop: "max(1rem, env(safe-area-inset-top))", paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 pb-5">
            <Link href="/" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3">
              <BrandLogo size={48} priority />
              <div className="min-w-0">
                <span className="block truncate font-heading text-lg font-black text-navy">المهاجر</span>
                <span className="block truncate text-[10px] font-bold text-amber-600">الثواني الأخيرة</span>
              </div>
            </Link>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-navy transition hover:bg-rose-50 hover:text-rose-600"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {user && (
            <div className="mx-5 mt-5 rounded-2xl border border-brand/10 bg-brand/5 p-4">
              <p className="truncate text-xs font-black text-navy">{user.name}</p>
              <p className="mt-1 text-[10px] text-slate-500">{user.role === "student" ? user.grade || "طالب" : "حساب إدارة"}</p>
            </div>
          )}

          <nav className="mt-4 flex flex-col gap-1.5 px-4">
            {links.map((link) => {
              const active = link.href === "/" ? normalizedPathname === "/" : normalizedPathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-black transition ${
                    active
                      ? "border-brand/15 bg-brand/10 text-brand"
                      : "border-transparent text-navy hover:border-brand/10 hover:bg-brand/5 hover:text-brand"
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-brand text-white" : "bg-slate-100 text-slate-500"}`}>
                    <FontAwesomeIcon icon={link.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {user && (
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black text-rose-600 transition hover:bg-rose-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </span>
                تسجيل الخروج
              </button>
            )}
          </nav>

          <div className="mt-auto space-y-3 border-t border-slate-100 px-5 pt-5">
            <div className="flex justify-center"><LanguageSwitcher /></div>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3.5 text-sm font-black text-emerald-700"
            >
              <FontAwesomeIcon icon={faWhatsapp} /> تواصل عبر واتساب
            </a>
            {!user && (
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-navy py-3.5 text-sm font-black text-white"
              >
                إنشاء حساب مجاني <FontAwesomeIcon icon={faArrowLeft} />
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
