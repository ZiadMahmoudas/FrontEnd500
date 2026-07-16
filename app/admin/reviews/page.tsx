"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faComments, faMagnifyingGlass, faReply, faSpinner,
  faStar, faTrashCan, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import AdminAlert from "@/components/admin/AdminAlert";
import { deleteAdminReview, getAdminReviews, updateAdminReview } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { CourseReview } from "@/lib/types";

type ReviewStatus = "pending" | "published" | "rejected";

const statusMeta: Record<ReviewStatus, { label: string; className: string }> = {
  pending: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-700 border-amber-200" },
  published: { label: "منشور", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "مرفوض", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

function Stars({ value }: { value: number }) {
  return <div className="flex gap-1" dir="ltr">{[1, 2, 3, 4, 5].map((star) => <FontAwesomeIcon key={star} icon={faStar} className={`h-3.5 w-3.5 ${star <= value ? "text-amber-400" : "text-slate-200"}`} />)}</div>;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | ReviewStatus>("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [replyId, setReplyId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await getAdminReviews({ status, search: search.trim() });
      setReviews(response.reviews);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحميل تقييمات الطلاب.");
    } finally { setLoading(false); }
  }, [search, status]);

  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer); }, [load]);

  const counters = useMemo(() => ({
    all: reviews.length,
    published: reviews.filter((item) => item.status === "published").length,
    pending: reviews.filter((item) => item.status === "pending").length,
    rejected: reviews.filter((item) => item.status === "rejected").length,
  }), [reviews]);

  async function changeStatus(review: CourseReview, next: ReviewStatus, adminReply = review.admin_reply || "") {
    setBusyId(review.id); setMessage(""); setError("");
    try {
      const response = await updateAdminReview(review.id, { status: next, admin_reply: adminReply });
      setMessage(response.message); setReplyId(null); await load();
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر تحديث التقييم."); }
    finally { setBusyId(null); }
  }

  async function remove(review: CourseReview) {
    if (!window.confirm(`حذف تقييم ${review.name} نهائيًا؟`)) return;
    setBusyId(review.id); setMessage(""); setError("");
    try { const response = await deleteAdminReview(review.id); setMessage(response.message); await load(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر حذف التقييم."); }
    finally { setBusyId(null); }
  }

  function startReply(review: CourseReview) { setReplyId(review.id); setReply(review.admin_reply || ""); }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><span className="text-xs font-black text-brand">آراء الطلاب بعد الاشتراك</span><h1 className="mt-1 font-heading text-3xl font-black text-navy">إدارة التقييمات والتعليقات</h1><p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">راجع ما يكتبه الطلاب، انشر أو ارفض التقييم، وأضف ردًا رسميًا باسم المدرس. التقييم العام للكورس يُحسب تلقائيًا من التقييمات المنشورة فقط.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[
          ["الكل", counters.all], ["منشور", counters.published], ["مراجعة", counters.pending], ["مرفوض", counters.rejected],
        ].map(([label, value]) => <div key={String(label)} className="min-w-24 rounded-2xl border border-white bg-white px-4 py-3 text-center shadow-sm"><strong className="block font-heading text-xl text-navy">{value}</strong><span className="text-[10px] font-bold text-slate-400">{label}</span></div>)}</div>
      </header>

      <section className="rounded-[26px] border border-white bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,.05)]">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative"><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="admin-input pr-11" placeholder="ابحث باسم الطالب أو هاتفه أو الكورس أو نص التعليق..." /></label>
          <select value={status} onChange={(event) => setStatus(event.target.value as "" | ReviewStatus)} className="admin-input"><option value="">كل الحالات</option><option value="published">منشور</option><option value="pending">قيد المراجعة</option><option value="rejected">مرفوض</option></select>
        </div>
      </section>

      {message && <AdminAlert message={message} />}{error && <AdminAlert message={error} tone="danger" />}

      {loading ? <div className="rounded-3xl bg-white p-16 text-center text-sm font-bold text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" />جاري تحميل التقييمات...</div> : reviews.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {reviews.map((review) => {
            const reviewStatus = (review.status || "published") as ReviewStatus;
            const meta = statusMeta[reviewStatus];
            const busy = busyId === review.id;
            return <article key={review.id} className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_12px_40px_rgba(15,23,42,.06)]">
              {review.image && <a href={review.image} target="_blank" rel="noreferrer" className="block bg-slate-100"><img src={review.image} alt="صورة مرفقة بتقييم الطالب" className="h-56 w-full object-cover" /></a>}
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 font-heading text-lg font-black text-brand">{review.name?.slice(0, 1) || "ط"}</div><div><h2 className="font-black text-navy">{review.name}</h2><p className="mt-1 text-[10px] text-slate-400">{review.phone || "بدون هاتف"} • {review.grade || "طالب"}</p></div></div><span className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${meta.className}`}>{meta.label}</span></div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><Stars value={review.rating} /><span className="text-[10px] text-slate-400">{new Date(review.created_at).toLocaleString("ar-EG")}</span></div>
                <p className="mt-4 min-h-16 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{review.comment}</p>
                <p className="mt-3 text-[11px] font-bold text-brand">الكورس: {review.course_title || "—"}</p>

                {replyId === review.id ? <div className="mt-4 rounded-2xl border border-brand/15 bg-brand/[.03] p-4"><label className="text-xs font-black text-navy">رد المدرس<textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={3} maxLength={1200} className="admin-input mt-2 h-auto py-3" placeholder="اكتب ردًا محترمًا وواضحًا للطالب..." /></label><div className="mt-3 flex gap-2"><button disabled={busy} onClick={() => changeStatus(review, reviewStatus, reply)} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-black text-white"><FontAwesomeIcon icon={busy ? faSpinner : faCheck} spin={busy} />حفظ الرد</button><button onClick={() => setReplyId(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-500">إلغاء</button></div></div> : review.admin_reply ? <div className="mt-4 rounded-2xl bg-brand/[.05] p-4"><span className="text-[10px] font-black text-brand">رد المدرس</span><p className="mt-1 text-xs leading-6 text-navy">{review.admin_reply}</p></div> : null}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <button disabled={busy} onClick={() => changeStatus(review, "published")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 disabled:opacity-50"><FontAwesomeIcon icon={busy ? faSpinner : faCheck} spin={busy} />نشر</button>
                  <button disabled={busy} onClick={() => changeStatus(review, "rejected")} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 disabled:opacity-50"><FontAwesomeIcon icon={faXmark} />رفض</button>
                  <button disabled={busy} onClick={() => startReply(review)} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 disabled:opacity-50"><FontAwesomeIcon icon={faReply} />رد المدرس</button>
                  <button disabled={busy} onClick={() => remove(review)} className="mr-auto inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3 py-2 text-xs font-black text-rose-600 disabled:opacity-50"><FontAwesomeIcon icon={faTrashCan} />حذف</button>
                </div>
              </div>
            </article>;
          })}
        </div>
      ) : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center"><FontAwesomeIcon icon={faComments} className="h-9 w-9 text-slate-300" /><h2 className="mt-4 font-heading text-xl font-black text-navy">لا توجد تقييمات مطابقة</h2><p className="mt-2 text-sm text-slate-400">ستظهر التقييمات هنا بعد أن يشترك الطلاب ويكتبوا آراءهم.</p></div>}
    </div>
  );
}
