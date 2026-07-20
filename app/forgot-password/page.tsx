"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LockKeyhole, MailCheck, MessageCircle, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { forgotPassword, resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

type ResetInfo = {
  requestId: number;
  delivery?: "email" | "support";
  destination?: string;
  whatsappUrl?: string;
  debugCode?: string;
  message: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isEnglish } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [info, setInfo] = useState<ResetInfo | null>(null);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const copy = useMemo(() => isEnglish ? {
    title: "Reset Your Password",
    subtitle: "Enter your phone number or email, then use the six-digit verification code.",
    identifier: "Phone Number or Email",
    send: "Create Reset Request",
    sending: "Creating Request...",
    code: "Verification Code",
    password: "New Password",
    confirm: "Confirm New Password",
    reset: "Change Password",
    resetting: "Changing Password...",
    mismatch: "The two passwords do not match.",
    back: "Back to Sign In",
    support: "Contact WhatsApp Support",
    localCode: "Local testing code",
    expires: "The code expires after 15 minutes.",
    done: "Password changed successfully. You can sign in now.",
  } : {
    title: "استعادة كلمة المرور",
    subtitle: "اكتب رقم الهاتف أو البريد، وبعدها استخدم رمز التحقق المكوّن من 6 أرقام.",
    identifier: "رقم الهاتف أو البريد الإلكتروني",
    send: "إنشاء طلب الاستعادة",
    sending: "جاري إنشاء الطلب...",
    code: "رمز التحقق",
    password: "كلمة المرور الجديدة",
    confirm: "تأكيد كلمة المرور",
    reset: "تغيير كلمة المرور",
    resetting: "جاري تغيير كلمة المرور...",
    mismatch: "كلمتا المرور غير متطابقتين.",
    back: "العودة لتسجيل الدخول",
    support: "التواصل مع دعم واتساب",
    localCode: "رمز الاختبار المحلي",
    expires: "ينتهي الرمز بعد 15 دقيقة.",
    done: "تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
  }, [isEnglish]);

  async function requestReset(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await forgotPassword(identifier);
      if (!response.requestId) {
        setSuccess(response.message);
        return;
      }
      setInfo({
        requestId: response.requestId,
        delivery: response.delivery,
        destination: response.destination,
        whatsappUrl: response.whatsappUrl,
        debugCode: response.debugCode,
        message: response.message,
      });
      if (response.debugCode) setCode(response.debugCode);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر إنشاء طلب الاستعادة.");
    } finally {
      setLoading(false);
    }
  }

  async function finishReset(event: FormEvent) {
    event.preventDefault();
    if (!info) return;
    setError("");
    if (newPassword !== confirmPassword) {
      setError(copy.mismatch);
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword({ requestId: info.requestId, code, newPassword });
      setSuccess(response.message || copy.done);
      setTimeout(() => router.replace("/login"), 1400);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تغيير كلمة المرور.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main data-no-translate className="min-h-screen bg-slate-100 px-4 py-8 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-lg">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={48} priority />
            <span className="font-heading text-lg font-black text-navy dark:text-white">{isEnglish ? "Elmohager" : "المهاجر"}</span>
          </Link>
          <div className="flex items-center gap-2"><ThemeToggle compact /><LanguageSwitcher compact /></div>
        </div>

        <section className="rounded-[30px] border border-white bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,.12)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand"><KeyRound className="h-6 w-6" /></div>
          <h1 className="mt-5 font-heading text-3xl font-black text-navy dark:text-white">{copy.title}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>

          {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
          {success && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</div>}

          {!info ? (
            <form onSubmit={requestReset} className="mt-7 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-black text-navy dark:text-white">{copy.identifier}</span>
                <div className="relative">
                  <MailCheck className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="admin-input ps-11" placeholder="01xxxxxxxxx" />
                </div>
              </label>
              <button disabled={loading} className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60">
                {loading ? copy.sending : copy.send}
              </button>
            </form>
          ) : (
            <form onSubmit={finishReset} className="mt-7 space-y-5">
              <div className="rounded-2xl border border-brand/15 bg-brand/5 p-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-brand" /><div><p className="font-black text-navy dark:text-white">{info.message}</p><p className="text-xs text-slate-500">{copy.expires}</p></div></div>
                {info.debugCode && <div className="mt-3 rounded-xl bg-white px-3 py-2 font-mono text-xs font-black text-brand dark:bg-slate-800">{copy.localCode}: {info.debugCode}</div>}
                {info.whatsappUrl && <a href={info.whatsappUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-white"><MessageCircle className="h-4 w-4" />{copy.support}</a>}
              </div>

              <label className="block"><span className="mb-2 block text-xs font-black text-navy dark:text-white">{copy.code}</span><input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="admin-input text-center font-mono tracking-[.45em]" placeholder="000000" /></label>
              <label className="block"><span className="mb-2 block text-xs font-black text-navy dark:text-white">{copy.password}</span><div className="relative"><LockKeyhole className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required minLength={8} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="admin-input ps-11" placeholder="••••••••" /></div></label>
              <label className="block"><span className="mb-2 block text-xs font-black text-navy dark:text-white">{copy.confirm}</span><input required minLength={8} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="admin-input" placeholder="••••••••" /></label>
              <button disabled={loading} className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60">{loading ? copy.resetting : copy.reset}</button>
            </form>
          )}

          <Link href="/login" className="mt-6 block text-center text-sm font-black text-brand">{copy.back}</Link>
        </section>
      </div>
    </main>
  );
}
