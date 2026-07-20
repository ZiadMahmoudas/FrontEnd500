"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clipboard, Clock3, KeyRound, MessageCircle, RefreshCw, ShieldAlert, X } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { closeAdminPasswordReset, getAdminPasswordResets, type AdminPasswordResetRequest } from "@/lib/api/admin";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function PasswordResetsPage() {
  const { isEnglish } = useLanguage();
  const [items, setItems] = useState<AdminPasswordResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const copy = useMemo(() => isEnglish ? {
    title: "Password Reset Requests", subtitle: "Give the verification code only after confirming the student's identity.",
    refresh: "Refresh", empty: "No active password reset requests.", request: "Request", student: "Student",
    studentPhone: "Student Phone", guardian: "Parent / Guardian Phone", code: "Verification Code", attempts: "Failed Attempts",
    expires: "Expires", copy: "Copy Code", copied: "Copied", whatsapp: "Send via WhatsApp", close: "Close Request",
    confirm: "Close this reset request?", fallback: "Unable to load password reset requests.", security: "Security notice",
    securityText: "Confirm the student's name, phone and guardian phone before sharing the code. Codes expire after 15 minutes.",
  } : {
    title: "طلبات استعادة كلمات المرور", subtitle: "سلّم رمز التحقق بعد التأكد من هوية الطالب فقط.",
    refresh: "تحديث", empty: "لا توجد طلبات استعادة فعالة حاليًا.", request: "رقم الطلب", student: "الطالب",
    studentPhone: "رقم الطالب", guardian: "رقم ولي الأمر", code: "رمز التحقق", attempts: "المحاولات الخاطئة",
    expires: "ينتهي", copy: "نسخ الرمز", copied: "تم النسخ", whatsapp: "إرسال عبر واتساب", close: "إغلاق الطلب",
    confirm: "هل تريد إغلاق طلب الاستعادة؟", fallback: "تعذر تحميل طلبات استعادة كلمات المرور.", security: "تنبيه أمني",
    securityText: "تأكد من اسم الطالب ورقمه ورقم ولي الأمر قبل مشاركة الرمز. الرمز ينتهي خلال 15 دقيقة.",
  }, [isEnglish]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminPasswordResets();
      setItems(response.items);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : copy.fallback);
    } finally {
      setLoading(false);
    }
  }, [copy.fallback]);

  useEffect(() => { void load(); }, [load]);

  async function close(id: number) {
    if (!window.confirm(copy.confirm)) return;
    await closeAdminPasswordReset(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function copyCode(item: AdminPasswordResetRequest) {
    if (!item.code) return;
    await navigator.clipboard.writeText(item.code);
    setCopied(item.id);
    window.setTimeout(() => setCopied(null), 1500);
  }

  function whatsappUrl(item: AdminPasswordResetRequest) {
    const target = item.studentPhone.replace(/\D/g, "").replace(/^0/, "20");
    const message = isEnglish
      ? `Elmohager password reset code: ${item.code}\nRequest: ${item.id}\nThe code expires shortly.`
      : `رمز استعادة كلمة المرور لمنصة المهاجر: ${item.code}\nرقم الطلب: ${item.id}\nالرمز صالح لفترة محدودة.`;
    return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div data-no-translate className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="font-heading text-2xl font-black text-navy dark:text-white">{copy.title}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{copy.subtitle}</p></div>
        <button onClick={() => void load()} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-navy shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />{copy.refresh}</button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-black">{copy.security}</p><p className="mt-1 text-xs leading-6">{copy.securityText}</p></div></div>
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

      {!loading && items.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-14 text-center dark:border-slate-700 dark:bg-slate-900"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" /><p className="mt-4 text-sm font-black text-navy dark:text-white">{copy.empty}</p></div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand"><KeyRound className="h-5 w-5" /></span><div><p className="text-xs font-black text-brand">{copy.request} #{item.id}</p><h2 className="mt-1 font-heading text-lg font-black text-navy dark:text-white">{item.studentName}</h2></div></div><button onClick={() => void close(item.id)} title={copy.close} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"><X className="h-4 w-4" /></button></div>
              <dl className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800/70 sm:grid-cols-2">
                <div><dt className="text-slate-400">{copy.studentPhone}</dt><dd className="mt-1 font-black text-navy dark:text-white">{item.studentPhone}</dd></div>
                <div><dt className="text-slate-400">{copy.guardian}</dt><dd className="mt-1 font-black text-navy dark:text-white">{item.guardianPhone || "—"}</dd></div>
                <div><dt className="text-slate-400">{copy.attempts}</dt><dd className="mt-1 font-black text-navy dark:text-white">{item.attempts}</dd></div>
                <div><dt className="text-slate-400">{copy.expires}</dt><dd className="mt-1 flex items-center gap-1 font-black text-navy dark:text-white"><Clock3 className="h-3.5 w-3.5" />{new Date(item.expiresAt).toLocaleString(isEnglish ? "en-US" : "ar-EG")}</dd></div>
              </dl>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-brand/15 bg-brand/5 p-4"><div><p className="text-[10px] font-black text-slate-400">{copy.code}</p><p className="mt-1 font-mono text-2xl font-black tracking-[.28em] text-brand">{item.code || "------"}</p></div><button onClick={() => void copyCode(item)} disabled={!item.code} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-brand shadow-sm disabled:opacity-50 dark:bg-slate-900"><Clipboard className="h-4 w-4" />{copied === item.id ? copy.copied : copy.copy}</button></div>
              <div className="mt-4 flex flex-wrap gap-2"><a href={whatsappUrl(item)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white"><MessageCircle className="h-4 w-4" />{copy.whatsapp}</a><button onClick={() => void close(item.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300"><X className="h-4 w-4" />{copy.close}</button></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
