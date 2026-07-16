"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEye, faEyeSlash, faLock, faPhone, faShieldHalved, faUserGraduate, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login({ identifier, password });
      const requested = new URLSearchParams(window.location.search).get("next");
      const safeNext = requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : null;
      const roleHome = response.user.role === "student" ? "/dashboard" : "/admin";
      const canUseNext = safeNext && (response.user.role === "student" ? !safeNext.startsWith("/admin") : true);
      router.push(canUseNext ? safeNext : roleHome);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر تسجيل الدخول حاليًا.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#07111f] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <Image src="/brand/cover.png" alt="الأستاذ محمود المهاجر - الثواني الأخيرة" fill priority sizes="(max-width: 1024px) 0px, 55vw" className="object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#07111f]/35 via-[#07111f]/45 to-[#07111f]" />
        <div className="absolute inset-0 bg-grid-lines bg-[size:46px_46px] opacity-10" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={56} priority />
            <div><p className="font-heading text-2xl font-black">المهاجر</p><p className="text-[10px] font-bold text-amber-300">الثواني الأخيرة • منصة الحاسب الآلي</p></div>
          </Link>
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-200"><FontAwesomeIcon icon={faShieldHalved} /> تعلم آمن ومنظم</span>
            <h1 className="mt-6 font-heading text-5xl font-black leading-[1.35]">ارجع كمّل من آخر سطر كود كتبته.</h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">كل كورساتك، تقدمك، الملازم والمدفوعات موجودة في لوحة واحدة سهلة وسريعة.</p>
          </div>
          <p className="text-xs text-slate-500">© 2026 منصة المهاجر</p>
        </div>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,.28),transparent_35%),radial-gradient(circle_at_0%_100%,rgba(34,211,238,.1),transparent_35%)] lg:hidden" />
        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <BrandLogo size={54} priority />
            <span className="font-heading text-xl font-black text-white">المهاجر</span>
          </Link>
          <div className="rounded-[30px] border border-white/10 bg-white p-6 shadow-[0_35px_90px_rgba(0,0,0,.28)] sm:p-8">
            <div className="text-center"><span className="text-xs font-black text-brand">أهلًا بعودتك</span><h2 className="mt-2 font-heading text-3xl font-black text-navy">تسجيل الدخول</h2><p className="mt-2 text-sm leading-6 text-slate-500">ادخل بياناتك للوصول إلى دروسك ومتابعة تقدمك.</p></div>
            {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-bold text-rose-600"><p>{error}</p><Link href="/system-status" className="mt-2 inline-block underline underline-offset-4">افحص اتصال الـAPI</Link></div>}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div><label className="mb-2 block text-xs font-black text-navy">رقم الهاتف أو البريد الإلكتروني</label><div className="relative"><FontAwesomeIcon icon={faPhone} className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/5" placeholder="01xxxxxxxxx" /></div></div>
              <div><div className="mb-2 flex items-center justify-between"><label className="text-xs font-black text-navy">كلمة المرور</label><Link href="#" className="text-[11px] font-black text-brand">نسيت كلمة المرور؟</Link></div><div className="relative"><FontAwesomeIcon icon={faLock} className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-12 text-sm outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/5" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-label="إظهار كلمة المرور"><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" /></button></div></div>
              <button disabled={loading} className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand to-blue-600 text-sm font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}<FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5 transition group-hover:-translate-x-1" /></button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">ليس لديك حساب؟ <Link href="/register" className="font-black text-brand">أنشئ حسابًا مجانيًا</Link></p>
         
          </div>
        </div>
      </section>
    </main>
  );
}
