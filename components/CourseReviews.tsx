"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faImage, faSpinner, faStar } from "@fortawesome/free-solid-svg-icons";
import ChunkFileUploader from "@/components/admin/ChunkFileUploader";
import AdminAlert from "@/components/admin/AdminAlert";
import { getCourseReviews, getMyCourseReview, saveCourseReview } from "@/lib/api/courses";
import { ApiError, getStoredToken } from "@/lib/api/client";
import type { CompletedUpload } from "@/lib/api/uploads";
import type { CourseReview, ReviewSummary } from "@/lib/types";

interface Props { courseId: string; canReview: boolean; }

function Stars({ value, onChange, readonly = false }: { value: number; onChange?: (value: number) => void; readonly?: boolean }) {
  return <div className="flex items-center gap-1" dir="ltr">{[1,2,3,4,5].map((star) => <button key={star} type="button" disabled={readonly} onClick={() => onChange?.(star)} className={`text-lg transition ${star <= value ? "text-amber-400" : "text-slate-200"} ${readonly ? "cursor-default" : "hover:scale-110"}`} aria-label={`${star} نجوم`}><FontAwesomeIcon icon={faStar} /></button>)}</div>;
}

export default function CourseReviews({ courseId, canReview }: Props) {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({ total: 0, average: 0, distribution: {} });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageUpload, setImageUpload] = useState<CompletedUpload | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCourseReviews(courseId);
      setReviews(response.reviews); setSummary(response.summary);
      if (canReview && getStoredToken()) {
        const mine = await getMyCourseReview(courseId).catch(() => null);
        if (mine?.review) {
          setRating(mine.review.rating); setComment(mine.review.comment); setExistingImage(mine.review.image || null);
        }
      }
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر تحميل التقييمات."); }
    finally { setLoading(false); }
  }, [canReview, courseId]);

  useEffect(() => { load(); }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const response = await saveCourseReview(courseId, { rating, comment, image_upload_id: imageUpload?.upload_id, remove_image: removeImage });
      setMessage(response.message); setImageUpload(null); setRemoveImage(false); await load();
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر حفظ التقييم."); }
    finally { setSaving(false); }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><span className="text-xs font-black text-brand">آراء طلاب حقيقيين</span><h2 className="mt-1 font-heading text-2xl font-black text-navy">تقييمات الكورس</h2><p className="mt-2 text-sm text-slate-500">لا يستطيع كتابة تقييم إلا الطالب المشترك في الكورس.</p></div><div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm"><strong className="font-heading text-3xl text-navy">{summary.total ? summary.average.toFixed(1) : "—"}</strong><div><Stars value={Math.round(summary.average)} readonly /><p className="mt-1 text-[10px] text-slate-400">{summary.total} تقييم</p></div></div></div>

      {canReview && (
        <form onSubmit={submit} className="rounded-[28px] border border-brand/10 bg-white p-5 shadow-[0_12px_38px_rgba(15,23,42,.05)] md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-black text-navy">شارك تجربتك مع المدرس</h3><p className="mt-1 text-xs text-slate-500">يمكنك تعديل تقييمك في أي وقت.</p></div><Stars value={rating} onChange={setRating} /></div>
          <label className="mt-5 block space-y-2 text-xs font-black text-navy">تعليقك<textarea required minLength={5} maxLength={1500} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="admin-input h-auto py-3" placeholder="اكتب رأيك في الشرح، تنظيم المحتوى وتجربتك مع الكورس..." /></label>
          <div className="mt-4 grid gap-4 lg:grid-cols-2"><ChunkFileUploader kind="image" accept="image/jpeg,image/png,image/webp" label="صورة اختيارية" hint="يمكن إرفاق صورة من جهازك، مثل نتيجة أو ملاحظة من الكورس. JPG/PNG/WebP حتى 10MB." value={imageUpload} onComplete={setImageUpload} onClear={() => setImageUpload(null)} />{existingImage && !removeImage && !imageUpload ? <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"><img src={existingImage} alt="صورة التقييم" className="h-48 w-full object-cover" /><button type="button" onClick={() => setRemoveImage(true)} className="absolute bottom-3 left-3 rounded-xl bg-rose-600 px-3 py-2 text-xs font-black text-white">حذف الصورة الحالية</button></div> : <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400"><FontAwesomeIcon icon={faImage} className="ml-2" />الصورة اختيارية</div>}</div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-h-8">{message && <AdminAlert message={message} />}{error && <AdminAlert message={error} tone="danger" />}</div><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-black text-white disabled:opacity-60"><FontAwesomeIcon icon={saving ? faSpinner : faCheckCircle} spin={saving} />{saving ? "جاري الحفظ..." : "نشر التقييم"}</button></div>
        </form>
      )}

      {!canReview && getStoredToken() && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-700">بعد تفعيل اشتراكك في الكورس سيظهر لك نموذج التقييم هنا.</div>}

      {loading ? <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" />جاري تحميل آراء الطلاب...</div> : reviews.length ? <div className="grid gap-4 md:grid-cols-2">{reviews.map((review) => <article key={review.id} className="overflow-hidden rounded-[26px] border border-white bg-white shadow-[0_10px_35px_rgba(15,23,42,.05)]">{review.image && <img src={review.image} alt="صورة مرفقة بالتقييم" className="h-48 w-full object-cover" />}<div className="p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 font-black text-brand">{review.name.slice(0,1)}</div><div><h3 className="text-sm font-black text-navy">{review.name}</h3><p className="mt-1 text-[10px] text-slate-400">{review.grade || "طالب"} • {new Date(review.created_at).toLocaleDateString("ar-EG")}</p></div></div><Stars value={review.rating} readonly /></div><p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>{review.admin_reply && <div className="mt-4 rounded-2xl bg-brand/[.05] p-4"><span className="text-[10px] font-black text-brand">رد المدرس</span><p className="mt-1 text-xs leading-6 text-navy">{review.admin_reply}</p></div>}</div></article>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">لا توجد تقييمات بعد. أول طالب مشترك يمكنه كتابة أول تقييم.</div>}
    </section>
  );
}
