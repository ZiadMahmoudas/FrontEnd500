"use client";

import { FormEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faCreditCard, faFloppyDisk, faGear, faMobileScreen, faSpinner, faTrashCan, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import AdminAlert from "@/components/admin/AdminAlert";
import { cleanupDemoData, clearPlatformContent, getAdminSettings, getMaintenanceSummary, updateAdminSettings, type AdminPlatformSettings } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";

const empty: AdminPlatformSettings = {
  platform_name: "المهاجر",
  instructor_name: "الأستاذ محمود المهاجر",
  support_email: "",
  vodafone_cash_number: "",
  vodafone_cash_account_name: "",
  instapay_mobile: "",
  instapay_account_name: "",
  instapay_ipa: "",
  whatsapp_number: "201110037311",
  paypal_mode: "sandbox",
  paypal_currency: "USD",
  paypal_enabled: false,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<AdminPlatformSettings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [cleaning, setCleaning] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const [demoCounts, setDemoCounts] = useState({ courses: 0, students: 0 });
  const [contentCounts, setContentCounts] = useState({ courses: 0, lessons: 0, students: 0, payments: 0, subscriptions: 0 });

  useEffect(() => {
    Promise.all([getAdminSettings(), getMaintenanceSummary()])
      .then(([settingsResponse, summaryResponse]) => {
        setForm(settingsResponse.settings);
        setDemoCounts(summaryResponse.demo);
        if (summaryResponse.content) setContentCounts(summaryResponse.content);
      })
      .catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر تحميل الإعدادات."))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { paypal_mode, paypal_currency, paypal_enabled, ...payload } = form;
      const response = await updateAdminSettings(payload);
      setSuccess(response.message);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حفظ الإعدادات.");
    } finally {
      setSaving(false);
    }
  }


  async function removeDemoData() {
    const confirmation = window.prompt('سيتم حذف الكورسات والطلاب التجريبيين فقط مع الحفاظ على حساب الأدمن والإعدادات.\nاكتب: حذف بيانات التجربة');
    if (confirmation !== "حذف بيانات التجربة") return;
    setCleaning(true);
    setError("");
    setSuccess("");
    try {
      const response = await cleanupDemoData(confirmation);
      setSuccess(response.message);
      setDemoCounts({ courses: 0, students: 0 });
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حذف بيانات التجربة.");
    } finally {
      setCleaning(false);
    }
  }


  async function clearAllContent() {
    const confirmation = window.prompt(
      "تحذير نهائي: سيتم حذف كل الكورسات والدروس والطلاب والمدفوعات والاشتراكات والملفات، مع الحفاظ على حسابات الإدارة والإعدادات فقط.\nاكتب: تفريغ المنصة بالكامل",
    );
    if (confirmation !== "تفريغ المنصة بالكامل") return;
    setClearingAll(true);
    setError("");
    setSuccess("");
    try {
      const response = await clearPlatformContent(confirmation);
      setSuccess(response.message);
      setDemoCounts({ courses: 0, students: 0 });
      setContentCounts({ courses: 0, lessons: 0, students: 0, payments: 0, subscriptions: 0 });
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تفريغ محتوى المنصة.");
    } finally {
      setClearingAll(false);
    }
  }

  if (loading) return <div className="flex min-h-72 items-center justify-center rounded-[28px] bg-white text-sm font-bold text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" /> جاري تحميل الإعدادات...</div>;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <span className="text-xs font-black text-brand">إعدادات عامة</span>
        <h1 className="mt-1 font-heading text-2xl font-black text-navy md:text-3xl">إعدادات المنصة والدفع</h1>
        <p className="mt-2 text-sm text-slate-500">غيّر بيانات المنصة والمدرس ووسائل الدفع وواتساب من لوحة الإدارة بدون تعديل ملفات الكود.</p>
      </section>

      <AdminAlert message={success} />
      <AdminAlert message={error} tone="danger" />

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-[28px] border border-white bg-white p-5 shadow-[0_12px_38px_rgba(15,23,42,.05)] md:p-6">
          <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand"><FontAwesomeIcon icon={faBuilding} /></span><div><h2 className="font-heading text-lg font-black text-navy">بيانات المنصة</h2><p className="mt-1 text-xs text-slate-500">البيانات الأساسية التي تظهر في الإدارة والتواصل.</p></div></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-xs font-black text-navy">اسم المنصة<input required value={form.platform_name} onChange={(event) => setForm({ ...form, platform_name: event.target.value })} className="admin-input" /></label>
            <label className="space-y-2 text-xs font-black text-navy">اسم المدرس / صاحب الحساب<input required value={form.instructor_name} onChange={(event) => setForm({ ...form, instructor_name: event.target.value })} className="admin-input" /></label>
            <label className="space-y-2 text-xs font-black text-navy">بريد الدعم<input type="email" value={form.support_email} onChange={(event) => setForm({ ...form, support_email: event.target.value })} className="admin-input" placeholder="support@example.com" /></label>
          </div>
        </section>

        <section className="rounded-[28px] border border-white bg-white p-5 shadow-[0_12px_38px_rgba(15,23,42,.05)] md:p-6">
          <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><FontAwesomeIcon icon={faMobileScreen} /></span><div><h2 className="font-heading text-lg font-black text-navy">فودافون كاش وInstaPay</h2><p className="mt-1 text-xs text-slate-500">هذه البيانات تظهر للطالب داخل صفحة الدفع ويتم تسجيلها مع كل عملية.</p></div></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs font-black text-navy">رقم فودافون كاش<input value={form.vodafone_cash_number} onChange={(event) => setForm({ ...form, vodafone_cash_number: event.target.value.replace(/\D/g, "") })} className="admin-input font-mono" dir="ltr" /></label>
            <label className="space-y-2 text-xs font-black text-navy">اسم حساب فودافون كاش<input value={form.vodafone_cash_account_name} onChange={(event) => setForm({ ...form, vodafone_cash_account_name: event.target.value })} className="admin-input" /></label>
            <label className="space-y-2 text-xs font-black text-navy">رقم InstaPay<input value={form.instapay_mobile} onChange={(event) => setForm({ ...form, instapay_mobile: event.target.value.replace(/\D/g, "") })} className="admin-input font-mono" dir="ltr" /></label>
            <label className="space-y-2 text-xs font-black text-navy">اسم حساب InstaPay<input value={form.instapay_account_name} onChange={(event) => setForm({ ...form, instapay_account_name: event.target.value })} className="admin-input" /></label>
            <label className="space-y-2 text-xs font-black text-navy md:col-span-2">InstaPay Payment Address اختياري<input value={form.instapay_ipa} onChange={(event) => setForm({ ...form, instapay_ipa: event.target.value })} className="admin-input font-mono text-left" dir="ltr" placeholder="omar@instapay" /></label>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[28px] border border-white bg-white p-5 shadow-[0_12px_38px_rgba(15,23,42,.05)] md:p-6">
            <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><FontAwesomeIcon icon={faCreditCard} /></span><div><h2 className="font-heading text-lg font-black text-navy">واتساب</h2><p className="mt-1 text-xs text-slate-500">رقم التواصل بصيغة دولية بدون علامة +.</p></div></div>
            <label className="mt-5 block space-y-2 text-xs font-black text-navy">رقم واتساب<input required value={form.whatsapp_number} onChange={(event) => setForm({ ...form, whatsapp_number: event.target.value.replace(/\D/g, "") })} className="admin-input font-mono" dir="ltr" placeholder="201110037311" /></label>
          </article>

          <article className="rounded-[28px] border border-white bg-[#07111f] p-5 text-white shadow-[0_18px_45px_rgba(15,23,42,.15)] md:p-6">
            <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300"><FontAwesomeIcon icon={faPaypal} /></span><div><h2 className="font-heading text-lg font-black">PayPal</h2><p className="mt-1 text-xs text-slate-400">بيانات PayPal السرية تظل داخل إعدادات استضافة الـAPI ولا تظهر في المتصفح.</p></div></div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center"><div className="rounded-2xl bg-white/5 p-3"><span className="block text-[10px] text-slate-400">الحالة</span><strong className={`mt-1 block text-xs ${form.paypal_enabled ? "text-emerald-300" : "text-amber-300"}`}>{form.paypal_enabled ? "مفعل" : "غير مفعل"}</strong></div><div className="rounded-2xl bg-white/5 p-3"><span className="block text-[10px] text-slate-400">الوضع</span><strong className="mt-1 block text-xs">{form.paypal_mode}</strong></div><div className="rounded-2xl bg-white/5 p-3"><span className="block text-[10px] text-slate-400">العملة</span><strong className="mt-1 block text-xs">{form.paypal_currency}</strong></div></div>
            <p className="mt-4 text-xs leading-6 text-slate-400">لتفعيل PayPal أضف Client ID وSecret داخل <code className="rounded bg-white/10 px-1">إعدادات الـAPI</code> ثم أعد تشغيل المنصة.</p>
          </article>
        </section>

        <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand to-blue-600 px-6 py-4 text-sm font-black text-white shadow-[0_14px_32px_rgba(37,99,235,.22)] disabled:opacity-60"><FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} spin={saving} /> {saving ? "جاري حفظ الإعدادات..." : "حفظ إعدادات المنصة والدفع"}</button>

        <section className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-600"><FontAwesomeIcon icon={faTriangleExclamation} /></span>
              <div><h2 className="font-heading text-lg font-black text-rose-800">تنظيف بيانات التجربة</h2><p className="mt-1 text-xs leading-6 text-rose-700">يحذف فقط البيانات التجريبية المعروفة: {demoCounts.courses} كورس و{demoCounts.students} طالب. لا يحذف حساب الأدمن أو الإعدادات.</p></div>
            </div>
            <button type="button" disabled={cleaning || (demoCounts.courses === 0 && demoCounts.students === 0)} onClick={removeDemoData} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300 bg-white px-5 py-3 text-sm font-black text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"><FontAwesomeIcon icon={cleaning ? faSpinner : faTrashCan} spin={cleaning} />{cleaning ? "جاري التنظيف..." : "حذف بيانات التجربة"}</button>
          </div>
        </section>

        <section className="rounded-[28px] border-2 border-rose-300 bg-white p-5 shadow-[0_18px_50px_rgba(225,29,72,.08)] md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white"><FontAwesomeIcon icon={faTrashCan} /></span>
                <div><h2 className="font-heading text-lg font-black text-rose-800">تفريغ محتوى المنصة بالكامل</h2><p className="mt-1 text-xs leading-6 text-slate-600">استخدمه قبل بدء العمل من الصفر. يحافظ على حسابات الإدارة والإعدادات فقط.</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black text-slate-600">
                <span className="rounded-xl bg-slate-100 px-3 py-2">{contentCounts.courses} كورس</span>
                <span className="rounded-xl bg-slate-100 px-3 py-2">{contentCounts.lessons} درس</span>
                <span className="rounded-xl bg-slate-100 px-3 py-2">{contentCounts.students} طالب</span>
                <span className="rounded-xl bg-slate-100 px-3 py-2">{contentCounts.payments} عملية دفع</span>
                <span className="rounded-xl bg-slate-100 px-3 py-2">{contentCounts.subscriptions} اشتراك</span>
              </div>
            </div>
            <button type="button" disabled={clearingAll} onClick={clearAllContent} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-rose-200 disabled:opacity-50"><FontAwesomeIcon icon={clearingAll ? faSpinner : faTriangleExclamation} spin={clearingAll} />{clearingAll ? "جاري التفريغ..." : "تفريغ المنصة"}</button>
          </div>
        </section>
      </form>
    </div>
  );
}
