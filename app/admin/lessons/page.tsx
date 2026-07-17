"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen, faCirclePlay, faCirclePlus, faCloudArrowUp, faFilePdf, faFilm, faFloppyDisk, faFolderTree,
  faLink, faMagnifyingGlass, faPenToSquare, faQrcode, faRotate, faSpinner, faTrashCan, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import AdminModal from "@/components/admin/AdminModal";
import AdminAlert from "@/components/admin/AdminAlert";
import ChunkFileUploader from "@/components/admin/ChunkFileUploader";
import StatusBadge from "@/components/StatusBadge";
import {
  createAdminLesson, createAdminUnit, deleteAdminLesson, deleteAdminUnit, getAdminCourseOptions, getAdminLessons,
  getAdminLessonMediaUrl, updateAdminLesson, updateAdminUnit, type AdminCourseOption, type AdminLesson, type AdminUnit, type LessonPayload,
} from "@/lib/api/admin";
import { ApiError, normalizeLocalMediaUrl } from "@/lib/api/client";
import type { CompletedUpload } from "@/lib/api/uploads";
import type { CourseStatus } from "@/lib/types";

const statusOptions: Array<{ value: CourseStatus; label: string }> = [
  { value: "published", label: "منشور" }, { value: "draft", label: "مسودة" }, { value: "coming_soon", label: "قريبًا" }, { value: "archived", label: "مؤرشف" },
];

type FormState = {
  course_id: string; unit_id: string; title: string; description: string; duration_minutes: string; sort_order: string;
  is_free: boolean; status: CourseStatus;
  video_source: "none" | "upload" | "youtube" | "vimeo" | "embed" | "external"; video_url: string;
  pdf_source: "none" | "upload" | "url"; pdf_url: string;
  thumbnail_source: "url" | "upload"; thumbnail_url: string;
};

const defaultThumbnail = "/brand/cover.png";
const emptyForm: FormState = {
  course_id: "", unit_id: "", title: "", description: "", duration_minutes: "0", sort_order: "1", is_free: false, status: "draft",
  video_source: "none", video_url: "", pdf_source: "none", pdf_url: "", thumbnail_source: "url", thumbnail_url: defaultThumbnail,
};

function statusBadge(status: CourseStatus) {
  if (status === "published") return <StatusBadge label="منشور" tone="success" />;
  if (status === "coming_soon") return <StatusBadge label="قريبًا" tone="warning" />;
  if (status === "archived") return <StatusBadge label="مؤرشف" tone="danger" />;
  return <StatusBadge label="مسودة" tone="brand" />;
}

const videoLabels: Record<FormState["video_source"], string> = { none: "بدون فيديو", upload: "مرفوع", youtube: "YouTube", vimeo: "Vimeo", embed: "مزود خارجي", external: "رابط مباشر" };
const pdfLabels: Record<FormState["pdf_source"], string> = { none: "بدون ملزمة", upload: "PDF مرفوع", url: "رابط PDF" };

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [courseOptions, setCourseOptions] = useState<AdminCourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminLesson | null>(null);
  const [editingUnit, setEditingUnit] = useState<AdminUnit | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [unitForm, setUnitForm] = useState({ course_id: "", title: "", sort_order: "1" });
  const [videoUpload, setVideoUpload] = useState<CompletedUpload | null>(null);
  const [pdfUpload, setPdfUpload] = useState<CompletedUpload | null>(null);
  const [thumbnailUpload, setThumbnailUpload] = useState<CompletedUpload | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [lessonResponse, optionResponse] = await Promise.all([getAdminLessons({ search, course_id: courseFilter, status: statusFilter }), getAdminCourseOptions()]);
      setLessons(lessonResponse.lessons); setCourseOptions(optionResponse.courses);
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر تحميل الدروس."); }
    finally { setLoading(false); }
  }, [courseFilter, search, statusFilter]);

  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer); }, [load]);
  const selectedCourse = useMemo(() => courseOptions.find((c) => String(c.id) === form.course_id), [courseOptions, form.course_id]);
  const selectedUnitCourse = useMemo(() => courseOptions.find((c) => String(c.id) === unitForm.course_id), [courseOptions, unitForm.course_id]);

  function clearUploads() { setVideoUpload(null); setPdfUpload(null); setThumbnailUpload(null); }
  function openCreate() {
    const first = courseOptions[0]; setEditing(null); setForm({ ...emptyForm, course_id: first ? String(first.id) : "", sort_order: String(lessons.length + 1) }); clearUploads(); setError(""); setModalOpen(true);
  }
  function openEdit(lesson: AdminLesson) {
    setEditing(lesson);
    setForm({
      course_id: String(lesson.course_id), unit_id: lesson.unit_id ? String(lesson.unit_id) : "", title: lesson.title,
      description: lesson.description || "", duration_minutes: String(lesson.duration_minutes), sort_order: String(lesson.sort_order),
      is_free: Boolean(Number(lesson.is_free)), status: lesson.status,
      video_source: lesson.video_source || (lesson.video_path ? "upload" : "none"), video_url: lesson.video_url || "",
      pdf_source: lesson.pdf_source || (lesson.pdf_path ? "upload" : "none"), pdf_url: lesson.pdf_url || "",
      thumbnail_source: lesson.thumbnail_source || "url", thumbnail_url: lesson.thumbnail_url || defaultThumbnail,
    });
    clearUploads(); setError(""); setModalOpen(true);
  }

  async function submitLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (form.video_source === "upload" && !videoUpload && !editing?.video_path) throw new ApiError("اختر الفيديو وانتظر اكتمال الرفع إلى 100%.", 422);
      if (["youtube", "vimeo", "embed", "external"].includes(form.video_source) && !form.video_url.trim()) throw new ApiError("اكتب رابط الفيديو.", 422);
      if (form.pdf_source === "upload" && !pdfUpload && !editing?.pdf_path) throw new ApiError("اختر ملف PDF وانتظر اكتمال الرفع.", 422);
      if (form.pdf_source === "url" && !form.pdf_url.trim()) throw new ApiError("اكتب رابط ملف PDF.", 422);
      if (form.thumbnail_source === "upload" && !thumbnailUpload && !editing?.thumbnail_path) throw new ApiError("ارفع الصورة المصغرة أولًا.", 422);

      const payload: LessonPayload = {
        course_id: Number(form.course_id), unit_id: form.unit_id ? Number(form.unit_id) : null,
        title: form.title, description: form.description, duration_minutes: Number(form.duration_minutes), sort_order: Number(form.sort_order),
        is_free: form.is_free, status: form.status,
        video_source: form.video_source, video_url: form.video_url, video_upload_id: videoUpload?.upload_id,
        pdf_source: form.pdf_source, pdf_url: form.pdf_url, pdf_upload_id: pdfUpload?.upload_id,
        thumbnail_source: form.thumbnail_source, thumbnail_url: form.thumbnail_url, thumbnail_upload_id: thumbnailUpload?.upload_id,
      };
      if (editing) await updateAdminLesson(editing.id, payload); else await createAdminLesson(payload);
      setSuccess(editing ? "تم تحديث الدرس ومصادره بنجاح." : "تم إنشاء الدرس بنجاح."); setModalOpen(false); await load();
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر حفظ الدرس."); }
    finally { setSaving(false); }
  }

  async function previewMedia(lesson: AdminLesson, type: "video" | "pdf") {
    try { const response = await getAdminLessonMediaUrl(lesson.id, type); window.open(normalizeLocalMediaUrl(response.url), "_blank", "noopener,noreferrer"); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر فتح المحتوى."); }
  }
  async function removeLesson(lesson: AdminLesson) {
    if (!window.confirm(`حذف درس «${lesson.title}» وكل ملفاته نهائيًا؟`)) return;
    try { await deleteAdminLesson(lesson.id); setSuccess("تم حذف الدرس وملفاته."); await load(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر حذف الدرس."); }
  }

  function openUnitCreate() { const first = courseOptions[0]; setEditingUnit(null); setUnitForm({ course_id: first ? String(first.id) : "", title: "", sort_order: String((first?.units.length || 0) + 1) }); setUnitModalOpen(true); }
  function openUnitEdit(unit: AdminUnit) { setEditingUnit(unit); setUnitForm({ course_id: String(unit.course_id), title: unit.title, sort_order: String(unit.sort_order) }); setUnitModalOpen(true); }
  async function submitUnit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (editingUnit) await updateAdminUnit(editingUnit.id, { title: unitForm.title, sort_order: Number(unitForm.sort_order) });
      else await createAdminUnit({ course_id: Number(unitForm.course_id), title: unitForm.title, sort_order: Number(unitForm.sort_order) });
      setSuccess(editingUnit ? "تم تحديث الوحدة." : "تمت إضافة الوحدة."); setUnitModalOpen(false); await load();
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر حفظ الوحدة."); }
    finally { setSaving(false); }
  }
  async function removeUnit(unit: AdminUnit) {
    if (!window.confirm(`حذف الوحدة «${unit.title}»؟ لن تُحذف الدروس.`)) return;
    try { await deleteAdminUnit(unit.id); setSuccess("تم حذف الوحدة مع الحفاظ على الدروس."); await load(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر حذف الوحدة."); }
  }

  const thumbnailPreview = thumbnailUpload?.url || (form.thumbnail_source === "upload" ? editing?.display_thumbnail_url : form.thumbnail_url) || defaultThumbnail;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><span className="text-xs font-black text-brand">مكتبة المنصة</span><h1 className="mt-1 font-heading text-2xl font-black text-navy md:text-3xl">الدروس والفيديوهات والملازم</h1><p className="mt-2 text-sm text-slate-500">YouTube أو Vimeo أو رفع مجزأ من الجهاز، مع PDF برابط أو ملف مرفوع.</p></div><div className="flex flex-wrap gap-2"><button onClick={openUnitCreate} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-navy"><FontAwesomeIcon icon={faFolderTree} className="ml-2" />إدارة الوحدات</button><Link href="/admin/qrcodes" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-navy"><FontAwesomeIcon icon={faQrcode} className="ml-2 text-brand" />رموز QR</Link><button onClick={openCreate} disabled={!courseOptions.length} className="rounded-2xl bg-brand px-5 py-3 text-sm font-black text-white disabled:opacity-50"><FontAwesomeIcon icon={faCirclePlus} className="ml-2" />إضافة درس</button></div></section>
      <AdminAlert message={success} /><AdminAlert message={error} tone="danger" />
      <section className="grid gap-3 rounded-[24px] bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_180px_auto]"><div className="relative"><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input pr-11" placeholder="ابحث عن درس أو كورس..." /></div><select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="admin-input"><option value="">كل الكورسات</option>{courseOptions.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input"><option value="">كل الحالات</option>{statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select><button onClick={load} className="rounded-2xl border border-slate-200 px-4 text-sm font-black"><FontAwesomeIcon icon={faRotate} className="ml-2" />تحديث</button></section>

      {loading ? <div className="flex min-h-72 items-center justify-center rounded-3xl bg-white text-sm text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" />جاري التحميل...</div> : lessons.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><FontAwesomeIcon icon={faBookOpen} className="text-4xl text-slate-300" /><p className="mt-4 font-black text-navy">لا توجد دروس.</p></div> : (
        <section className="overflow-hidden rounded-[28px] bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-right text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-4">الدرس</th><th className="p-4">الكورس والوحدة</th><th className="p-4">الفيديو</th><th className="p-4">الملزمة</th><th className="p-4">الحالة</th><th className="p-4">المدة</th><th className="p-4">إجراءات</th></tr></thead><tbody className="divide-y divide-slate-100">{lessons.map((lesson) => (
          <tr key={lesson.id} className="hover:bg-slate-50/60"><td className="p-4"><div className="flex items-center gap-3"><img src={lesson.display_thumbnail_url || lesson.thumbnail_url} alt="" className="h-12 w-16 rounded-xl object-cover" /><div><p className="font-black text-navy">{lesson.title}</p><p className="mt-1 text-[10px] text-slate-400">ترتيب {lesson.sort_order}{Boolean(Number(lesson.is_free)) ? " • مجاني" : ""}</p></div></div></td><td className="p-4"><p className="text-xs font-bold text-navy">{lesson.course_title}</p><p className="mt-1 text-[10px] text-slate-400">{lesson.unit_title || "بدون وحدة"}</p></td><td className="p-4"><button disabled={!Boolean(Number(lesson.has_video))} onClick={() => previewMedia(lesson, "video")} className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 disabled:opacity-40"><FontAwesomeIcon icon={faCirclePlay} className="ml-2" />{videoLabels[lesson.video_source || "none"]}</button></td><td className="p-4"><button disabled={!Boolean(Number(lesson.has_pdf))} onClick={() => previewMedia(lesson, "pdf")} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 disabled:opacity-40"><FontAwesomeIcon icon={faFilePdf} className="ml-2" />{pdfLabels[lesson.pdf_source || "none"]}</button></td><td className="p-4">{statusBadge(lesson.status)}</td><td className="p-4 font-mono font-black">{lesson.duration_minutes} د</td><td className="p-4"><div className="flex gap-2"><button onClick={() => openEdit(lesson)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 text-blue-600"><FontAwesomeIcon icon={faPenToSquare} /></button><button onClick={() => removeLesson(lesson)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 text-rose-600"><FontAwesomeIcon icon={faTrashCan} /></button></div></td></tr>
        ))}</tbody></table></div></section>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "تعديل الدرس" : "إضافة درس جديد"} subtitle="استخدام YouTube أو Vimeo أفضل لتخفيف الضغط على السيرفر. الرفع المحلي يعمل بنظام الأجزاء مع شريط تقدم." widthClass="max-w-5xl">
        <form onSubmit={submitLesson} className="space-y-5">{error && <AdminAlert message={error} tone="danger" />}
          <div className="grid gap-4 md:grid-cols-2"><label className="space-y-2 text-xs font-black text-navy">الكورس<select required value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value, unit_id: "" })} className="admin-input"><option value="">اختر الكورس</option>{courseOptions.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label className="space-y-2 text-xs font-black text-navy">الوحدة<select value={form.unit_id} onChange={(e) => setForm({ ...form, unit_id: e.target.value })} className="admin-input"><option value="">بدون وحدة</option>{selectedCourse?.units.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</select></label></div>
          <label className="block space-y-2 text-xs font-black text-navy">عنوان الدرس<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" /></label>
          <label className="block space-y-2 text-xs font-black text-navy">شرح الدرس<textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input h-auto py-3" /></label>
          <div className="grid gap-4 sm:grid-cols-3"><label className="space-y-2 text-xs font-black text-navy">المدة بالدقائق<input min={0} type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="admin-input" /></label><label className="space-y-2 text-xs font-black text-navy">ترتيب الدرس<input min={1} type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="admin-input" /></label><label className="space-y-2 text-xs font-black text-navy">حالة النشر<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CourseStatus })} className="admin-input">{statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label></div>

          <section className="rounded-3xl border border-blue-100 bg-blue-50/30 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-navy"><FontAwesomeIcon icon={faFilm} className="ml-2 text-blue-600" />فيديو الدرس</h3><p className="mt-1 text-[11px] text-slate-500">اختر مصدرًا واحدًا. YouTube/Vimeo يقللان تكلفة ومساحة السيرفر.</p></div><select value={form.video_source} onChange={(e) => setForm({ ...form, video_source: e.target.value as FormState["video_source"] })} className="admin-input w-auto min-w-48"><option value="none">بدون فيديو الآن</option><option value="youtube">رابط YouTube</option><option value="vimeo">رابط Vimeo</option><option value="embed">رابط Embed من مزود خارجي</option><option value="external">رابط MP4/WebM مباشر</option><option value="upload">رفع من الجهاز</option></select></div>
            {form.video_source === "upload" ? <div className="mt-4"><ChunkFileUploader kind="video" accept="video/mp4,video/webm" label="رفع الفيديو" hint="MP4 أو WebM حتى 2GB. يُرفع على أجزاء 2MB مع إعادة المحاولة تلقائيًا." existingLabel={editing?.video_path ? "استبدال الفيديو المرفوع" : undefined} value={videoUpload} onComplete={setVideoUpload} onClear={() => setVideoUpload(null)} /></div> : ["youtube", "vimeo", "embed", "external"].includes(form.video_source) ? <label className="mt-4 block space-y-2 text-xs font-black text-navy">رابط الفيديو<input type="url" dir="ltr" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="admin-input font-mono text-left text-xs" placeholder={form.video_source === "youtube" ? "https://www.youtube.com/watch?v=..." : form.video_source === "embed" ? "https://player.example.com/embed/..." : "https://..."} /></label> : <p className="mt-4 rounded-2xl bg-white p-4 text-xs text-slate-500">يمكن حفظ الدرس الآن وإضافة الفيديو لاحقًا.</p>}
          </section>

          <section className="rounded-3xl border border-rose-100 bg-rose-50/30 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-navy"><FontAwesomeIcon icon={faFilePdf} className="ml-2 text-rose-600" />ملزمة الدرس</h3><p className="mt-1 text-[11px] text-slate-500">الملف المرفوع يكون محميًا؛ الرابط الخارجي يظهر بعد التحقق من الاشتراك لكنه يظل لدى مزود التخزين.</p></div><select value={form.pdf_source} onChange={(e) => setForm({ ...form, pdf_source: e.target.value as FormState["pdf_source"] })} className="admin-input w-auto min-w-48"><option value="none">بدون ملزمة</option><option value="upload">رفع PDF من الجهاز</option><option value="url">رابط PDF خارجي</option></select></div>
            {form.pdf_source === "upload" ? <div className="mt-4"><ChunkFileUploader kind="pdf" accept="application/pdf" label="رفع الملزمة" hint="PDF حتى 100MB، مع رفع مجزأ وشريط تقدم." existingLabel={editing?.pdf_path ? "استبدال الملزمة الحالية" : undefined} value={pdfUpload} onComplete={setPdfUpload} onClear={() => setPdfUpload(null)} /></div> : form.pdf_source === "url" ? <label className="mt-4 block space-y-2 text-xs font-black text-navy">رابط PDF<input type="url" dir="ltr" value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} className="admin-input font-mono text-left text-xs" /></label> : null}
          </section>

          <section className="rounded-3xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-navy">الصورة المصغرة</h3><p className="mt-1 text-[11px] text-slate-500">من الجهاز أو رابط خارجي.</p></div><div className="flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setForm({ ...form, thumbnail_source: "upload" })} className={`rounded-lg px-3 py-2 text-xs font-black ${form.thumbnail_source === "upload" ? "bg-white text-brand" : "text-slate-500"}`}><FontAwesomeIcon icon={faCloudArrowUp} className="ml-1" />جهاز</button><button type="button" onClick={() => setForm({ ...form, thumbnail_source: "url" })} className={`rounded-lg px-3 py-2 text-xs font-black ${form.thumbnail_source === "url" ? "bg-white text-brand" : "text-slate-500"}`}><FontAwesomeIcon icon={faLink} className="ml-1" />رابط</button></div></div><div className="mt-4 grid gap-4 md:grid-cols-[1fr_260px]">{form.thumbnail_source === "upload" ? <ChunkFileUploader kind="image" accept="image/jpeg,image/png,image/webp" label="رفع الصورة المصغرة" hint="JPG أو PNG أو WebP حتى 10MB." existingLabel={editing?.thumbnail_path ? "استبدال الصورة الحالية" : undefined} value={thumbnailUpload} onComplete={setThumbnailUpload} onClear={() => setThumbnailUpload(null)} /> : <label className="space-y-2 text-xs font-black text-navy">رابط الصورة<input type="url" dir="ltr" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="admin-input font-mono text-left text-xs" /></label>}<img src={thumbnailPreview} alt="معاينة" className="h-40 w-full rounded-2xl object-cover" /></div></section>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"><span><strong className="block text-sm text-navy">درس مجاني</strong><small className="mt-1 block text-xs text-slate-500">يمكن فتحه دون شراء الكورس.</small></span><input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} className="h-5 w-5 accent-blue-600" /></label>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold leading-6 text-emerald-800">لن يتم إرسال فيديو 100MB في طلب واحد بعد الآن. كل ملف يُرفع على أجزاء صغيرة، ثم يتم حفظ بيانات الدرس في طلب سريع منفصل؛ وهذا يمنع الانتظار الطويل وخطأ 422 الناتج عن حدود PHP.</div>
          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModalOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600"><FontAwesomeIcon icon={faXmark} className="ml-2" />إلغاء</button><button disabled={saving} className="rounded-2xl bg-brand px-6 py-3 text-sm font-black text-white disabled:opacity-60"><FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} spin={saving} className="ml-2" />{saving ? "جاري الحفظ..." : editing ? "حفظ التعديلات" : "إنشاء الدرس"}</button></div>
        </form>
      </AdminModal>

      <AdminModal open={unitModalOpen} onClose={() => setUnitModalOpen(false)} title={editingUnit ? "تعديل الوحدة" : "إدارة وحدات الكورس"} subtitle="الوحدات تنظّم الدروس داخل صفحة الكورس." widthClass="max-w-2xl"><form onSubmit={submitUnit} className="space-y-4">{error && <AdminAlert message={error} tone="danger" />}{!editingUnit && <label className="block space-y-2 text-xs font-black text-navy">الكورس<select required value={unitForm.course_id} onChange={(e) => setUnitForm({ ...unitForm, course_id: e.target.value })} className="admin-input"><option value="">اختر الكورس</option>{courseOptions.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>}<div className="grid gap-4 sm:grid-cols-[1fr_130px]"><label className="space-y-2 text-xs font-black text-navy">اسم الوحدة<input required value={unitForm.title} onChange={(e) => setUnitForm({ ...unitForm, title: e.target.value })} className="admin-input" /></label><label className="space-y-2 text-xs font-black text-navy">الترتيب<input min={1} type="number" value={unitForm.sort_order} onChange={(e) => setUnitForm({ ...unitForm, sort_order: e.target.value })} className="admin-input" /></label></div><button disabled={saving} className="w-full rounded-2xl bg-brand px-5 py-3 text-sm font-black text-white"><FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} spin={saving} className="ml-2" />حفظ الوحدة</button></form>{!editingUnit && selectedUnitCourse && <div className="mt-6 border-t pt-5"><h3 className="text-sm font-black text-navy">وحدات {selectedUnitCourse.title}</h3><div className="mt-3 space-y-2">{selectedUnitCourse.units.map((unit) => <div key={unit.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-xs font-black text-brand">{unit.sort_order}</span><span className="flex-1 text-xs font-black text-navy">{unit.title}</span><button onClick={() => openUnitEdit(unit)} className="h-9 w-9 rounded-xl border border-blue-100 text-blue-600"><FontAwesomeIcon icon={faPenToSquare} /></button><button onClick={() => removeUnit(unit)} className="h-9 w-9 rounded-xl border border-rose-100 text-rose-600"><FontAwesomeIcon icon={faTrashCan} /></button></div>)}</div></div>}</AdminModal>
    </div>
  );
}
