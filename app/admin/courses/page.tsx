"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faBookOpen, faCirclePlus, faCloudArrowUp, faFloppyDisk, faImage, faLink, faMagnifyingGlass, faPenToSquare, faRotate, faSpinner, faStar, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import AdminModal from "@/components/admin/AdminModal";
import AdminAlert from "@/components/admin/AdminAlert";
import ChunkFileUploader from "@/components/admin/ChunkFileUploader";
import StatusBadge from "@/components/StatusBadge";
import { archiveAdminCourse, createAdminCourse, deleteAdminCoursePermanently, getAdminCourses, updateAdminCourse, type AdminCourse, type CoursePayload } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { CompletedUpload } from "@/lib/api/uploads";
import type { CourseStatus, Grade } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const grades: Grade[] = ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"];
const statuses: Array<{ value: CourseStatus; label: string }> = [
  { value: "published", label: "منشور" }, { value: "draft", label: "مسودة" }, { value: "coming_soon", label: "قريبًا" }, { value: "archived", label: "مؤرشف" },
];

const defaultImage = "/brand/cover.png";
const emptyForm: CoursePayload = {
  slug: "", title: "", short_description: "", description: "", image_url: defaultImage, image_source: "url",
  grade: "الثالث الثانوي", price: 0, paypal_price: 0, status: "draft", is_new: true, tags: [],
};

function badge(status: CourseStatus) {
  if (status === "published") return <StatusBadge label="منشور" tone="success" />;
  if (status === "coming_soon") return <StatusBadge label="قريبًا" tone="warning" />;
  if (status === "archived") return <StatusBadge label="مؤرشف" tone="danger" />;
  return <StatusBadge label="مسودة" tone="brand" />;
}

function parseTags(value: AdminCourse["tags_json"]): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.map(String) : []; } catch { return []; }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [form, setForm] = useState<CoursePayload>(emptyForm);
  const [tagsText, setTagsText] = useState("");
  const [imageUpload, setImageUpload] = useState<CompletedUpload | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const response = await getAdminCourses(); setCourses(response.courses); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر تحميل الكورسات."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => courses.filter((course) => {
    const match = !search || course.title.includes(search) || course.slug.toLowerCase().includes(search.toLowerCase());
    return match && (!statusFilter || course.status === statusFilter);
  }), [courses, search, statusFilter]);

  function openCreate() {
    setEditing(null); setForm({ ...emptyForm, slug: `course-${Date.now().toString().slice(-8)}` }); setTagsText(""); setImageUpload(null); setError(""); setModalOpen(true);
  }

  function openEdit(course: AdminCourse) {
    const tags = parseTags(course.tags_json);
    setEditing(course);
    setForm({
      slug: course.slug, title: course.title, short_description: course.short_description, description: course.description,
      image_url: course.image_url || defaultImage, image_source: course.image_source || "url", grade: course.grade,
      price: Number(course.price), paypal_price: Number(course.paypal_price), status: course.status,
      is_new: Boolean(Number(course.is_new)), tags,
    });
    setTagsText(tags.join("، ")); setImageUpload(null); setError(""); setModalOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (form.image_source === "upload" && !imageUpload && !editing?.image_path) throw new ApiError("ارفع صورة الكورس أولًا وانتظر اكتمال الرفع إلى 100%.", 422);
      const payload: CoursePayload = {
        ...form,
        image_upload_id: imageUpload?.upload_id,
        tags: tagsText.split(/[,،]/).map((tag) => tag.trim()).filter(Boolean),
      };
      if (editing) await updateAdminCourse(editing.id, payload); else await createAdminCourse(payload);
      setSuccess(editing ? "تم تحديث الكورس والصورة بنجاح." : "تم إنشاء الكورس بنجاح."); setModalOpen(false); await load();
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر حفظ الكورس."); }
    finally { setSaving(false); }
  }

  async function archive(course: AdminCourse) {
    if (!window.confirm(`هل تريد أرشفة كورس «${course.title}»؟`)) return;
    try { await archiveAdminCourse(course.id); setSuccess("تمت أرشفة الكورس مع الحفاظ على الاشتراكات والمدفوعات."); await load(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر أرشفة الكورس."); }
  }

  async function removePermanently(course: AdminCourse) {
    const typed = window.prompt(`سيتم حذف «${course.title}» ودروسه وملفاته واشتراكاته ومدفوعاته نهائيًا.\nاكتب اسم الكورس للتأكيد:`);
    if (typed !== course.title) return;
    try {
      const response = await deleteAdminCoursePermanently(course.id);
      setSuccess(response.message);
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حذف الكورس نهائيًا.");
    }
  }

  const preview = imageUpload?.url || (form.image_source === "upload" ? editing?.display_image_url : form.image_url) || defaultImage;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><span className="text-xs font-black text-brand">إدارة المحتوى</span><h1 className="mt-1 font-heading text-2xl font-black text-navy md:text-3xl">الكورسات</h1><p className="mt-2 text-sm text-slate-500">صورة من الجهاز أو رابط، تسعير، نشر ومتابعة تقييمات الطلاب.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg"><FontAwesomeIcon icon={faCirclePlus} /> إضافة كورس جديد</button>
      </section>
      <AdminAlert message={success} /><AdminAlert message={error} tone="danger" />

      <section className="grid gap-3 rounded-[24px] border border-white bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
        <div className="relative"><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm outline-none" placeholder="ابحث باسم الكورس أو الرابط..." /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"><option value="">كل الحالات</option>{statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
        <button onClick={load} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-black text-navy"><FontAwesomeIcon icon={faRotate} /> تحديث</button>
      </section>

      {loading ? <div className="flex min-h-72 items-center justify-center rounded-[28px] bg-white text-sm font-bold text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" /> جاري التحميل...</div> : filtered.length === 0 ? <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center"><FontAwesomeIcon icon={faBookOpen} className="text-4xl text-slate-300" /><p className="mt-4 text-sm font-black text-navy">لا توجد كورسات مطابقة.</p></div> : (
        <section className="overflow-hidden rounded-[28px] border border-white bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-right text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-4">الكورس</th><th className="p-4">الصف</th><th className="p-4">السعر</th><th className="p-4">الدروس</th><th className="p-4">التقييمات</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((course) => (
          <tr key={course.id} className="hover:bg-slate-50/70"><td className="p-4"><div className="flex items-center gap-3"><img src={course.display_image_url || course.image_url} alt={course.title} className="h-14 w-20 rounded-2xl object-cover" /><div className="min-w-0"><p className="max-w-[280px] truncate font-black text-navy">{course.title}</p><p className="mt-1 font-mono text-[10px] text-slate-400">/{course.slug}</p></div></div></td><td className="p-4 text-xs font-bold text-slate-600">{course.grade}</td><td className="p-4"><strong>{formatPrice(Number(course.price))}</strong><p className="mt-1 text-[10px] text-slate-400">PayPal ${Number(course.paypal_price).toFixed(2)}</p></td><td className="p-4 font-mono font-black">{course.lessons_count}</td><td className="p-4"><span className="inline-flex items-center gap-1 font-black text-amber-500"><FontAwesomeIcon icon={faStar} /> {Number(course.rating).toFixed(1)}</span><p className="mt-1 text-[10px] text-slate-400">{course.reviews_count || 0} تعليق</p></td><td className="p-4">{badge(course.status)}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => openEdit(course)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 text-blue-600"><FontAwesomeIcon icon={faPenToSquare} /></button><button title="أرشفة" onClick={() => archive(course)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 text-amber-600"><FontAwesomeIcon icon={faArchive} /></button><button title="حذف نهائي" onClick={() => removePermanently(course)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600"><FontAwesomeIcon icon={faTrashCan} /></button></div></td></tr>
        ))}</tbody></table></div></section>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "تعديل الكورس" : "إضافة كورس جديد"} subtitle="التقييم الحقيقي يكتبه الطلاب بعد الاشتراك، ولا يتم وضعه يدويًا." widthClass="max-w-4xl">
        <form onSubmit={submit} className="space-y-5">
          {error && <AdminAlert message={error} tone="danger" />}
          <div className="grid gap-4 md:grid-cols-2"><label className="space-y-2 text-xs font-black text-navy">اسم الكورس<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" /></label><label className="space-y-2 text-xs font-black text-navy">الرابط المختصر<input required dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className="admin-input font-mono text-left" /></label></div>
          <label className="block space-y-2 text-xs font-black text-navy">وصف مختصر<input required value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="admin-input" /></label>
          <label className="block space-y-2 text-xs font-black text-navy">الوصف الكامل<textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input h-auto py-3" /></label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><label className="space-y-2 text-xs font-black text-navy">الصف<select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value as Grade })} className="admin-input">{grades.map((g) => <option key={g}>{g}</option>)}</select></label><label className="space-y-2 text-xs font-black text-navy">السعر بالجنيه<input min={0} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="admin-input" /></label><label className="space-y-2 text-xs font-black text-navy">PayPal بالدولار<input min={0} step="0.01" type="number" value={form.paypal_price} onChange={(e) => setForm({ ...form, paypal_price: Number(e.target.value) })} className="admin-input" /></label><label className="space-y-2 text-xs font-black text-navy">الحالة<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CourseStatus })} className="admin-input">{statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label></div>

          <section className="rounded-3xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-black text-navy">صورة الكورس</h3><p className="mt-1 text-[11px] text-slate-500">ارفعها من جهازك أو استخدم رابط صورة خارجي.</p></div><div className="flex rounded-2xl bg-slate-100 p-1"><button type="button" onClick={() => setForm({ ...form, image_source: "upload" })} className={`rounded-xl px-4 py-2 text-xs font-black ${form.image_source === "upload" ? "bg-white text-brand shadow-sm" : "text-slate-500"}`}><FontAwesomeIcon icon={faCloudArrowUp} className="ml-2" />من الجهاز</button><button type="button" onClick={() => setForm({ ...form, image_source: "url" })} className={`rounded-xl px-4 py-2 text-xs font-black ${form.image_source === "url" ? "bg-white text-brand shadow-sm" : "text-slate-500"}`}><FontAwesomeIcon icon={faLink} className="ml-2" />رابط</button></div></div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_260px]">{form.image_source === "upload" ? <ChunkFileUploader kind="image" accept="image/jpeg,image/png,image/webp" label="رفع صورة الكورس" hint="JPG أو PNG أو WebP حتى 10MB. الرفع يتم على أجزاء صغيرة." existingLabel={editing?.image_path ? "استبدال الصورة الحالية" : undefined} value={imageUpload} onComplete={setImageUpload} onClear={() => setImageUpload(null)} /> : <label className="space-y-2 text-xs font-black text-navy">رابط الصورة<input type="url" dir="ltr" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="admin-input font-mono text-left text-xs" /></label>}<div className="relative min-h-40 overflow-hidden rounded-2xl bg-slate-100"><img src={preview} alt="معاينة" className="absolute inset-0 h-full w-full object-cover" /><span className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold text-white"><FontAwesomeIcon icon={faImage} className="ml-1" /> معاينة</span></div></div>
          </section>

          <label className="block space-y-2 text-xs font-black text-navy">الوسوم مفصولة بفاصلة<input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="admin-input" placeholder="برمجة، Python، ثانوية عامة" /></label>
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"><span><strong className="block text-sm text-navy">وضع علامة جديد</strong><small className="mt-1 block text-xs text-slate-500">تظهر على بطاقة الكورس.</small></span><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="h-5 w-5 accent-blue-600" /></label>
          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModalOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600"><FontAwesomeIcon icon={faXmark} className="ml-2" />إلغاء</button><button disabled={saving} className="rounded-2xl bg-brand px-6 py-3 text-sm font-black text-white disabled:opacity-60"><FontAwesomeIcon icon={saving ? faSpinner : faFloppyDisk} spin={saving} className="ml-2" />{saving ? "جاري الحفظ..." : "حفظ الكورس"}</button></div>
        </form>
      </AdminModal>
    </div>
  );
}
