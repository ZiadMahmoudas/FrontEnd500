"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCopy,
  faDownload,
  faPowerOff,
  faQrcode,
  faRotate,
  faSpinner,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import AdminAlert from "@/components/admin/AdminAlert";
import StatusBadge from "@/components/StatusBadge";
import {
  createAdminQrCode,
  deleteAdminQrCode,
  getAdminCourseOptions,
  getAdminLessons,
  getAdminQrCodes,
  updateAdminQrCode,
  type AdminCourseOption,
  type AdminLesson,
  type AdminQrCode,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";

export default function AdminQRCodesPage() {
  const [items, setItems] = useState<AdminQrCode[]>([]);
  const [courses, setCourses] = useState<AdminCourseOption[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [type, setType] = useState<"course" | "lesson" | "pdf">("course");
  const [targetId, setTargetId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [qrResponse, courseResponse, lessonResponse] = await Promise.all([
        getAdminQrCodes(),
        getAdminCourseOptions(),
        getAdminLessons({ status: "published" }),
      ]);
      setItems(qrResponse.qr_codes);
      setCourses(courseResponse.courses);
      setLessons(lessonResponse.lessons);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحميل رموز QR.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const targets = useMemo(() => type === "course"
    ? courses.map((course) => ({ id: course.id, title: course.title }))
    : lessons.filter((lesson) => type !== "pdf" || Boolean(Number(lesson.has_pdf))).map((lesson) => ({ id: lesson.id, title: `${lesson.title} — ${lesson.course_title}` })), [courses, lessons, type]);

  useEffect(() => {
    if (!targets.some((target) => String(target.id) === targetId)) setTargetId(targets[0] ? String(targets[0].id) : "");
  }, [targetId, targets]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createAdminQrCode({ target_type: type, target_id: Number(targetId), expires_at: expiresAt || undefined });
      setSuccess("تم إنشاء رمز QR وربطه بالمحتوى.");
      setExpiresAt("");
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر إنشاء الرمز.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(item: AdminQrCode) {
    try {
      await updateAdminQrCode(item.id, { is_active: !Boolean(Number(item.is_active)), expires_at: item.expires_at || undefined });
      setSuccess(Boolean(Number(item.is_active)) ? "تم إيقاف رمز QR." : "تم تفعيل رمز QR.");
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحديث الرمز.");
    }
  }

  async function remove(item: AdminQrCode) {
    if (!window.confirm(`حذف رمز ${item.code} نهائيًا؟`)) return;
    try {
      await deleteAdminQrCode(item.id);
      setSuccess("تم حذف رمز QR.");
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حذف الرمز.");
    }
  }

  async function copy(item: AdminQrCode) {
    await navigator.clipboard.writeText(item.link);
    setCopied(item.id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="flex flex-col gap-7">
      <section>
        <span className="text-xs font-black text-brand">الوصول السريع</span>
        <h1 className="mt-1 font-heading text-2xl font-black text-navy md:text-3xl">رموز QR للكورسات والدروس</h1>
        <p className="mt-2 text-sm text-slate-500">أنشئ كودًا يفتح صفحة شراء الكورس أو الدرس، وأوقفه أو احذفه في أي وقت.</p>
      </section>

      <AdminAlert message={success} />
      <AdminAlert message={error} tone="danger" />

      <form onSubmit={create} className="rounded-[28px] border border-white bg-white p-5 shadow-[0_12px_38px_rgba(15,23,42,.05)] md:p-6">
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-xl text-brand"><FontAwesomeIcon icon={faQrcode} /></span><div><h2 className="font-heading text-lg font-black text-navy">توليد رمز جديد</h2><p className="mt-1 text-xs text-slate-500">اختر نوع المحتوى والعنصر المرتبط به.</p></div></div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[190px_1fr_230px_auto]">
          <label className="space-y-2 text-xs font-black text-navy">نوع المحتوى<select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="admin-input"><option value="course">كورس</option><option value="lesson">درس</option><option value="pdf">ملزمة PDF</option></select></label>
          <label className="space-y-2 text-xs font-black text-navy">العنصر<select required value={targetId} onChange={(event) => setTargetId(event.target.value)} className="admin-input"><option value="">اختر العنصر</option>{targets.map((target) => <option key={target.id} value={target.id}>{target.title}</option>)}</select></label>
          <label className="space-y-2 text-xs font-black text-navy">تاريخ انتهاء اختياري<input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="admin-input" /></label>
          <button disabled={saving || !targetId} className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-black text-white disabled:opacity-50"><FontAwesomeIcon icon={saving ? faSpinner : faQrcode} spin={saving} /> {saving ? "جاري الإنشاء..." : "توليد QR"}</button>
        </div>
      </form>

      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-[28px] bg-white text-sm font-bold text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" /> جاري تحميل الرموز...</div>
      ) : items.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center"><FontAwesomeIcon icon={faQrcode} className="text-5xl text-slate-300" /><p className="mt-4 text-sm font-black text-navy">لم يتم إنشاء رموز بعد.</p></div>
      ) : (
        <section>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-heading text-lg font-black text-navy">الرموز المولدة ({items.length})</h2><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-navy"><FontAwesomeIcon icon={faRotate} /> تحديث</button></div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const active = Boolean(Number(item.is_active));
              return (
                <article key={item.id} className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_12px_38px_rgba(15,23,42,.06)]">
                  <div className="bg-[radial-gradient(circle_at_top,rgba(37,99,235,.12),transparent_65%)] p-5 text-center">
                    {/* The QR image comes from a remote QR rendering endpoint; the encoded link is generated by our API. */}
                    <img src={item.image_url} alt={`QR ${item.code}`} className="mx-auto h-52 w-52 rounded-3xl border border-slate-100 bg-white p-2" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-black text-navy">{item.target_title || "محتوى غير موجود"}</p><p className="mt-1 font-mono text-[10px] text-slate-400">{item.code}</p></div>{active ? <StatusBadge label="فعال" tone="success" /> : <StatusBadge label="متوقف" tone="danger" />}</div>
                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-xs"><div><span className="block text-[10px] text-slate-400">النوع</span><strong className="mt-1 block text-navy">{item.target_type === "course" ? "كورس" : item.target_type === "lesson" ? "درس" : "PDF"}</strong></div><div><span className="block text-[10px] text-slate-400">مرات المسح</span><strong className="mt-1 block font-mono text-navy">{item.scans}</strong></div></div>
                    {item.expires_at && <p className="mt-3 text-[10px] font-bold text-amber-600">ينتهي: {new Date(item.expires_at).toLocaleString("ar-EG")}</p>}
                    <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => copy(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-navy"><FontAwesomeIcon icon={copied === item.id ? faCheck : faCopy} className={copied === item.id ? "text-emerald-600" : "text-brand"} /> {copied === item.id ? "تم النسخ" : "نسخ الرابط"}</button><a href={item.image_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-navy"><FontAwesomeIcon icon={faDownload} className="text-brand" /> فتح الصورة</a><button onClick={() => toggle(item)} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-black ${active ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}><FontAwesomeIcon icon={faPowerOff} /> {active ? "إيقاف" : "تفعيل"}</button><button onClick={() => remove(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-black text-rose-600"><FontAwesomeIcon icon={faTrashCan} /> حذف</button></div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
