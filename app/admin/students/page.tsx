"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCircleCheck,
  faGraduationCap,
  faKey,
  faMagnifyingGlass,
  faRotate,
  faSpinner,
  faTrashCan,
  faUserCheck,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import AdminModal from "@/components/admin/AdminModal";
import AdminAlert from "@/components/admin/AdminAlert";
import StatusBadge from "@/components/StatusBadge";
import {
  activateAdminSubscription,
  deleteAdminStudent,
  deleteAdminSubscription,
  getAdminCourseOptions,
  getAdminStudents,
  getAdminStudentSubscriptions,
  setAdminStudentStatus,
  type AdminCourseOption,
  type AdminStudent,
  type AdminSubscription,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { PaymentMethod } from "@/lib/types";

const methods: Array<{ value: PaymentMethod; label: string }> = [
  { value: "manual", label: "تفعيل يدوي" },
  { value: "vodafone_cash", label: "فودافون كاش" },
  { value: "instapay", label: "InstaPay" },
  { value: "whatsapp", label: "واتساب" },
  { value: "free", label: "مجاني" },
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [courses, setCourses] = useState<AdminCourseOption[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<AdminStudent | null>(null);
  const [activationOpen, setActivationOpen] = useState(false);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("manual");
  const [expiresAt, setExpiresAt] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [studentResponse, courseResponse] = await Promise.all([getAdminStudents(query), getAdminCourseOptions()]);
      setStudents(studentResponse.students);
      setCourses(courseResponse.courses);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحميل الطلاب.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeout = window.setTimeout(load, 250);
    return () => window.clearTimeout(timeout);
  }, [load]);

  function openActivation(student: AdminStudent) {
    setSelected(student);
    setCourseId(courses[0] ? String(courses[0].id) : "");
    setMethod("manual");
    setExpiresAt("");
    setError("");
    setActivationOpen(true);
  }

  async function openSubscriptions(student: AdminStudent) {
    setSelected(student);
    setSubscriptionsOpen(true);
    setSubscriptionsLoading(true);
    setError("");
    try {
      const response = await getAdminStudentSubscriptions(student.id);
      setSubscriptions(response.subscriptions);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحميل اشتراكات الطالب.");
    } finally {
      setSubscriptionsLoading(false);
    }
  }

  async function toggleStatus(student: AdminStudent) {
    const next = student.status === "active" ? "disabled" : "active";
    const verb = next === "disabled" ? "تعطيل" : "إعادة تفعيل";
    if (!window.confirm(`${verb} حساب الطالب «${student.name}»؟`)) return;
    try {
      await setAdminStudentStatus(student.id, next);
      setSuccess(`تم ${verb} حساب الطالب.`);
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحديث الطالب.");
    }
  }

  async function removeStudent(student: AdminStudent) {
    const typed = window.prompt(`سيتم حذف الطالب «${student.name}» واشتراكاته ومدفوعاته وتقييماته نهائيًا.\nاكتب رقم الهاتف للتأكيد:`);
    if (typed !== student.phone) return;
    try {
      const response = await deleteAdminStudent(student.id);
      setSuccess(response.message);
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حذف الطالب.");
    }
  }

  async function removeSubscription(subscription: AdminSubscription) {
    if (!window.confirm(`إلغاء وصول الطالب إلى كورس «${subscription.course_title}»؟`)) return;
    try {
      const response = await deleteAdminSubscription(subscription.id);
      setSuccess(response.message);
      setSubscriptions((items) => items.filter((item) => item.id !== subscription.id));
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حذف الاشتراك.");
    }
  }

  async function activate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      await activateAdminSubscription(selected.id, { course_id: Number(courseId), method, expires_at: expiresAt || undefined });
      setSuccess(`تم تفعيل الكورس للطالب ${selected.name}.`);
      setActivationOpen(false);
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تفعيل الاشتراك.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <span className="text-xs font-black text-brand">إدارة المستخدمين</span>
        <h1 className="mt-1 font-heading text-2xl font-black text-navy md:text-3xl">الطلاب والاشتراكات</h1>
        <p className="mt-2 text-sm text-slate-500">فعّل أو ألغِ اشتراكًا، عطّل الحساب، أو احذف الطالب وبياناته نهائيًا.</p>
      </section>

      <AdminAlert message={success} />
      <AdminAlert message={error} tone="danger" />

      <section className="flex flex-col gap-3 rounded-[24px] border border-white bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1"><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm outline-none focus:border-brand/40 focus:bg-white" placeholder="ابحث بالاسم أو رقم الهاتف..." /></div>
        <button onClick={load} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-black text-navy hover:bg-slate-50"><FontAwesomeIcon icon={faRotate} /> تحديث</button>
      </section>

      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-[28px] bg-white text-sm font-bold text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" /> جاري تحميل الطلاب...</div>
      ) : students.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center"><FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-slate-300" /><p className="mt-4 text-sm font-black text-navy">لا يوجد طلاب مطابقون.</p></div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-white bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-right text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-4">الطالب</th><th className="p-4">رقم ولي الأمر</th><th className="p-4">الصف</th><th className="p-4">المحافظة</th><th className="p-4">الاشتراكات</th><th className="p-4">تاريخ التسجيل</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="transition hover:bg-slate-50/70">
                    <td className="p-4"><div className="flex items-center gap-3">{student.avatar_url ? <Image src={student.avatar_url} alt={student.name} width={44} height={44} className="h-11 w-11 rounded-2xl object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 font-black text-brand">{student.name.slice(0, 1)}</span>}<div><p className="font-black text-navy">{student.name}</p><p className="mt-1 font-mono text-[10px] text-slate-400">{student.phone}{student.email ? ` • ${student.email}` : ""}</p></div></div></td>
                    <td className="p-4 font-mono text-xs font-bold text-slate-600">{student.guardian_phone || "—"}</td>
                    <td className="p-4 text-xs font-bold text-slate-600">{student.grade || "—"}</td>
                    <td className="p-4 text-xs font-bold text-slate-600">{student.governorate || "—"}</td>
                    <td className="p-4"><button onClick={() => openSubscriptions(student)} className="inline-flex min-w-10 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 font-mono font-black text-blue-700"><FontAwesomeIcon icon={faKey} />{student.subscriptions_count}</button></td>
                    <td className="p-4 text-xs text-slate-500">{new Date(student.created_at).toLocaleDateString("ar-EG")}</td>
                    <td className="p-4">{student.status === "active" ? <StatusBadge label="نشط" tone="success" /> : <StatusBadge label="معطل" tone="danger" />}</td>
                    <td className="p-4"><div className="flex items-center gap-2"><button onClick={() => openActivation(student)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"><FontAwesomeIcon icon={faUserCheck} /> تفعيل كورس</button><button onClick={() => toggleStatus(student)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black ${student.status === "active" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}><FontAwesomeIcon icon={student.status === "active" ? faBan : faCircleCheck} /> {student.status === "active" ? "تعطيل" : "تفعيل الحساب"}</button><button title="حذف نهائي" onClick={() => removeStudent(student)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600"><FontAwesomeIcon icon={faTrashCan} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdminModal open={activationOpen} onClose={() => setActivationOpen(false)} title="تفعيل اشتراك يدوي" subtitle={selected ? `سيتم منح ${selected.name} وصولًا مباشرًا إلى الكورس المختار.` : ""} widthClass="max-w-xl">
        <form onSubmit={activate} className="space-y-5">
          <div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand"><FontAwesomeIcon icon={faUserShield} /></span><div><p className="text-sm font-black text-navy">{selected?.name}</p><p className="mt-1 font-mono text-xs text-slate-500">{selected?.phone}</p></div></div></div>
          <label className="block space-y-2 text-xs font-black text-navy">الكورس<select required value={courseId} onChange={(event) => setCourseId(event.target.value)} className="admin-input"><option value="">اختر الكورس</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
          <label className="block space-y-2 text-xs font-black text-navy">سبب / وسيلة التفعيل<select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)} className="admin-input">{methods.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label className="block space-y-2 text-xs font-black text-navy">تاريخ انتهاء اختياري<input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="admin-input" /></label>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-6 text-amber-800">التفعيل اليدوي يمنح الوصول، لكنه لا ينشئ عملية دفع محاسبية.</div>
          <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-black text-white disabled:opacity-60"><FontAwesomeIcon icon={saving ? faSpinner : faUserCheck} spin={saving} /> {saving ? "جاري التفعيل..." : "تفعيل الكورس للطالب"}</button>
        </form>
      </AdminModal>

      <AdminModal open={subscriptionsOpen} onClose={() => setSubscriptionsOpen(false)} title="اشتراكات الطالب" subtitle={selected ? `تحكم في وصول ${selected.name} إلى الكورسات.` : ""} widthClass="max-w-2xl">
        {subscriptionsLoading ? <div className="py-12 text-center text-sm font-bold text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-brand" />جاري التحميل...</div> : subscriptions.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-500">لا توجد اشتراكات لهذا الطالب.</div> : <div className="space-y-3">{subscriptions.map((subscription) => <div key={subscription.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-sm font-black text-navy">{subscription.course_title}</p><p className="mt-1 text-[11px] text-slate-500">{subscription.method} • {subscription.status}{subscription.expires_at ? ` • ينتهي ${new Date(subscription.expires_at).toLocaleDateString("ar-EG")}` : ""}</p></div><button onClick={() => removeSubscription(subscription)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-black text-rose-600"><FontAwesomeIcon icon={faTrashCan} />إلغاء الاشتراك</button></div>)}</div>}
      </AdminModal>
    </div>
  );
}
