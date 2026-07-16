"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faBookOpen, faCode, faGaugeHigh, faGraduationCap, faHouse, faRightFromBracket, faRightToBracket, faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "./auth/AuthProvider";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201158870645";
  const links = [
    { href: "/", label: "الرئيسية", icon: faHouse },
    { href: "/courses", label: "الكورسات", icon: faBookOpen },
    ...(user?.role === "student" ? [{ href: "/dashboard", label: "لوحة الطالب", icon: faGraduationCap }] : []),
    ...(user && user.role !== "student" ? [{ href: "/admin", label: "لوحة الإدارة", icon: faGaugeHigh }] : []),
    ...(!user ? [{ href: "/login", label: "تسجيل الدخول", icon: faRightToBracket }, { href: "/register", label: "إنشاء حساب", icon: faUserPlus }] : []),
  ];

  async function logout() {
    setOpen(false);
    await signOut();
  }

  return (
    <div className="md:hidden">
      <button aria-label="فتح القائمة" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-navy shadow-sm">
        <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <button aria-label="إغلاق القائمة" className="absolute inset-0 bg-navy/65 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-cyan-400 text-white"><FontAwesomeIcon icon={faCode} /></span>
                <span className="font-heading text-lg font-black text-navy">كود<span className="text-brand">باث</span></span>
              </Link>
              <button aria-label="إغلاق" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-navy"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            {user && <div className="mt-5 rounded-2xl bg-brand/5 p-4"><p className="text-xs font-black text-navy">{user.name}</p><p className="mt-1 text-[10px] text-slate-500">{user.role === "student" ? user.grade || "طالب" : "حساب إدارة"}</p></div>}
            <nav className="mt-5 flex flex-col gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3.5 text-sm font-black text-navy transition hover:border-brand/10 hover:bg-brand/5 hover:text-brand">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><FontAwesomeIcon icon={link.icon} className="h-3.5 w-3.5" /></span>{link.label}
                </Link>
              ))}
              {user && <button onClick={logout} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black text-rose-600 hover:bg-rose-50"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50"><FontAwesomeIcon icon={faRightFromBracket} /></span>تسجيل الخروج</button>}
            </nav>
            <div className="mt-auto space-y-3 border-t border-slate-100 pt-5">
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3.5 text-sm font-black text-emerald-700"><FontAwesomeIcon icon={faWhatsapp} /> تواصل عبر واتساب</a>
              {!user && <Link href="/register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl bg-navy py-3.5 text-sm font-black text-white">إنشاء حساب مجاني <FontAwesomeIcon icon={faArrowLeft} /></Link>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
