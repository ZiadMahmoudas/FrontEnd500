"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faEyeSlash, faLock, faPhone, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { isEnglish } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const copy = useMemo(() => isEnglish ? {
    brand: "Elmohager", tagline: "The Final Seconds • Computer Science Platform", badge: "Secure and organized learning",
    hero: "Continue from the last line of code you wrote.", heroText: "Your courses, progress, notes and payments are available in one clear dashboard.",
    welcome: "Welcome back", title: "Sign In", subtitle: "Enter your details to access your lessons and continue learning.",
    identifier: "Phone Number or Email", password: "Password", forgot: "Forgot password?", show: "Show password",
    hide: "Hide password", submit: "Sign In", submitting: "Signing In...", noAccount: "Do not have an account?",
    register: "Create a free account", api: "Check API connection", fallback: "Unable to sign in right now.", copyright: "© 2026 Elmohager Platform",
  } : {
    brand: "المهاجر", tagline: "الثواني الأخيرة • منصة الحاسب الآلي", badge: "تعلم آمن ومنظم",
    hero: "ارجع كمّل من آخر سطر كود كتبته.", heroText: "كل كورساتك، تقدمك، الملازم والمدفوعات موجودة في لوحة واحدة سهلة وسريعة.",
    welcome: "أهلًا بعودتك", title: "تسجيل الدخول", subtitle: "ادخل بياناتك للوصول إلى دروسك ومتابعة تقدمك.",
    identifier: "رقم الهاتف أو البريد الإلكتروني", password: "كلمة المرور", forgot: "نسيت كلمة المرور؟", show: "إظهار كلمة المرور",
    hide: "إخفاء كلمة المرور", submit: "تسجيل الدخول", submitting: "جاري تسجيل الدخول...", noAccount: "ليس لديك حساب؟",
    register: "أنشئ حسابًا مجانيًا", api: "افحص اتصال الـAPI", fallback: "تعذر تسجيل الدخول حاليًا.", copyright: "© 2026 منصة المهاجر",
  }, [isEnglish]);

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
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : copy.fallback);
    } finally {
      setLoading(false);
    }
  }

  const Arrow = isEnglish ? faArrowRight : faArrowLeft;

  return (
    <main data-no-translate className="relative grid min-h-screen bg-[#07111f] lg:grid-cols-[1.05fr_.95fr]">
      <div className="absolute end-4 top-4 z-30 flex items-center gap-2"><ThemeToggle compact dark /><LanguageSwitcher compact dark /></div>
      <section className="relative hidden overflow-hidden lg:block">
        <Image src="/brand/cover.png" alt={copy.brand} fill priority sizes="(max-width: 1024px) 0px, 55vw" className="object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#07111f]/35 via-[#07111f]/45 to-[#07111f]" />
        <div className="absolute inset-0 bg-grid-lines bg-[size:46px_46px] opacity-10" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Link href="/" className="flex items-center gap-3"><BrandLogo size={56} priority /><div><p className="font-heading text-2xl font-black">{copy.brand}</p><p className="text-[10px] font-bold text-amber-300">{copy.tagline}</p></div></Link>
          <div className="max-w-xl"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-200"><FontAwesomeIcon icon={faShieldHalved} /> {copy.badge}</span><h1 className="mt-6 font-heading text-5xl font-black leading-[1.35]">{copy.hero}</h1><p className="mt-5 max-w-lg text-base leading-8 text-slate-300">{copy.heroText}</p></div>
          <p className="text-xs text-slate-500">{copy.copyright}</p>
        </div>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden px-4 py-20 sm:px-8 lg:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,.28),transparent_35%),radial-gradient(circle_at_0%_100%,rgba(34,211,238,.1),transparent_35%)] lg:hidden" />
        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3 lg:hidden"><BrandLogo size={54} priority /><span className="font-heading text-xl font-black text-white">{copy.brand}</span></Link>
          <div className="rounded-[30px] border border-white/10 bg-white p-6 shadow-[0_35px_90px_rgba(0,0,0,.28)] dark:bg-slate-900 sm:p-8">
            <div className="text-center"><span className="text-xs font-black text-brand">{copy.welcome}</span><h1 className="mt-2 font-heading text-3xl font-black text-navy dark:text-white">{copy.title}</h1><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{copy.subtitle}</p></div>
            {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-bold text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"><p>{error}</p><Link href="/system-status" className="mt-2 inline-block underline underline-offset-4">{copy.api}</Link></div>}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div><label className="mb-2 block text-xs font-black text-navy dark:text-white">{copy.identifier}</label><div className="relative"><FontAwesomeIcon icon={faPhone} className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="admin-input ps-11" placeholder="01xxxxxxxxx" /></div></div>
              <div><div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-black text-navy dark:text-white">{copy.password}</label><Link href="/forgot-password" className="text-[11px] font-black text-brand">{copy.forgot}</Link></div><div className="relative"><FontAwesomeIcon icon={faLock} className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input ps-11 pe-12" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? copy.hide : copy.show}><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" /></button></div></div>
              <button disabled={loading} className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand to-blue-600 text-sm font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">{loading ? copy.submitting : copy.submit}<FontAwesomeIcon icon={Arrow} className="h-3.5 w-3.5" /></button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{copy.noAccount} <Link href="/register" className="font-black text-brand">{copy.register}</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
