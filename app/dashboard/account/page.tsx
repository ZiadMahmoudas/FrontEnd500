"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, cloneElement, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, KeyRound, Save, ShieldCheck, Trash2, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleGuard from "@/components/auth/RoleGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ApiError } from "@/lib/api/client";
import {
  changeStudentPassword,
  deleteStudentAvatar,
  getStudentProfile,
  updateStudentProfile,
  uploadStudentAvatar,
} from "@/lib/api/student";

const grades = ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"];
const governorates = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "الغربية", "أسيوط", "سوهاج", "المنيا", "قنا", "أسوان"];

export default function AccountPage() {
  return <RoleGuard roles={["student"]}><AccountEditor /></RoleGuard>;
}

function AccountEditor() {
  const { user, refresh } = useAuth();
  const { isEnglish } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", guardianPhone: "", email: "", grade: grades[2], governorate: governorates[0] });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const copy = useMemo(() => isEnglish ? {
    title: "Account Settings", subtitle: "Update your personal details, parent phone number, profile photo and password.",
    back: "Back to Dashboard", photo: "Profile Photo", photoHint: "JPG, PNG, WEBP or GIF up to 10 MB.",
    upload: "Upload New Photo", remove: "Remove Photo", details: "Personal Details", name: "Full Name",
    phone: "Student Phone", guardian: "Parent / Guardian Phone", email: "Email (Optional)", grade: "Grade",
    governorate: "Governorate", save: "Save Changes", saving: "Saving...", password: "Change Password",
    current: "Current Password", next: "New Password", confirm: "Confirm New Password", change: "Update Password",
    mismatch: "The two new passwords do not match.", different: "The parent phone number must be different from the student phone number.",
    protected: "Your account is protected", protectedText: "Course access, payments and learning progress stay linked to your verified account.",
  } : {
    title: "إعدادات الحساب", subtitle: "عدّل بياناتك ورقم ولي الأمر وصورة الحساب وكلمة المرور.",
    back: "العودة للوحة الطالب", photo: "صورة الحساب", photoHint: "JPG أو PNG أو WEBP أو GIF بحد أقصى 10MB.",
    upload: "رفع صورة جديدة", remove: "حذف الصورة", details: "البيانات الشخصية", name: "الاسم بالكامل",
    phone: "رقم هاتف الطالب", guardian: "رقم هاتف ولي الأمر", email: "البريد الإلكتروني (اختياري)", grade: "الصف الدراسي",
    governorate: "المحافظة", save: "حفظ التعديلات", saving: "جاري الحفظ...", password: "تغيير كلمة المرور",
    current: "كلمة المرور الحالية", next: "كلمة المرور الجديدة", confirm: "تأكيد كلمة المرور الجديدة", change: "تحديث كلمة المرور",
    mismatch: "كلمتا المرور الجديدتان غير متطابقتين.", different: "رقم ولي الأمر يجب أن يكون مختلفًا عن رقم الطالب.",
    protected: "حسابك محمي", protectedText: "الكورسات والمدفوعات وتقدم التعلم تظل مرتبطة بحسابك الموثق.",
  }, [isEnglish]);

  useEffect(() => {
    getStudentProfile()
      .then((response) => setForm({
        name: response.user.name || "",
        phone: response.user.phone || "",
        guardianPhone: response.user.guardianPhone || "",
        email: response.user.email || "",
        grade: response.user.grade || grades[2],
        governorate: response.user.governorate || governorates[0],
      }))
      .catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر تحميل بيانات الحساب."))
      .finally(() => setLoading(false));
  }, []);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (form.phone === form.guardianPhone) {
      setError(copy.different);
      return;
    }
    setSaving(true);
    try {
      const response = await updateStudentProfile(form);
      setMessage(response.message);
      await refresh();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حفظ البيانات.");
    } finally {
      setSaving(false);
    }
  }

  async function chooseAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await uploadStudentAvatar(file);
      setMessage(response.message);
      await refresh();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر رفع الصورة.");
    } finally {
      setAvatarBusy(false);
      event.target.value = "";
    }
  }

  async function removeAvatar() {
    if (!user?.avatarUrl) return;
    setAvatarBusy(true);
    setError("");
    try {
      const response = await deleteStudentAvatar();
      setMessage(response.message);
      await refresh();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حذف الصورة.");
    } finally {
      setAvatarBusy(false);
    }
  }

  async function updatePassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError(copy.mismatch);
      return;
    }
    setSaving(true);
    try {
      const response = await changeStudentPassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setMessage(response.message);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تغيير كلمة المرور.");
    } finally {
      setSaving(false);
    }
  }

  const BackIcon = isEnglish ? ArrowLeft : ArrowRight;

  return (
    <div data-no-translate className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Navbar />
      <main className="container-app py-8 md:py-12">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-xs font-black text-brand"><BackIcon className="h-4 w-4" />{copy.back}</Link>
        <div className="mb-7">
          <h1 className="font-heading text-3xl font-black text-navy dark:text-white">{copy.title}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
        </div>

        {error && <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
        {message && <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">{message}</div>}

        {loading ? <div className="rounded-3xl bg-white p-12 text-center text-sm font-bold text-slate-400 dark:bg-slate-900">...</div> : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[26px] bg-gradient-to-br from-brand to-cyan-400 text-white shadow-lg">
                    {user?.avatarUrl ? <Image src={user.avatarUrl} alt={user.name} fill sizes="112px" className="object-cover" unoptimized /> : <span className="flex h-full w-full items-center justify-center text-4xl font-black">{(user?.name || "S").slice(0, 1)}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-heading text-xl font-black text-navy dark:text-white">{copy.photo}</h2>
                    <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{copy.photoHint}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-xs font-black text-white transition hover:-translate-y-0.5">
                        <Camera className="h-4 w-4" />{avatarBusy ? "..." : copy.upload}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={chooseAvatar} className="hidden" disabled={avatarBusy} />
                      </label>
                      {user?.avatarUrl && <button type="button" onClick={removeAvatar} disabled={avatarBusy} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-xs font-black text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30"><Trash2 className="h-4 w-4" />{copy.remove}</button>}
                    </div>
                  </div>
                </div>
              </section>

              <form onSubmit={saveProfile} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
                <div className="mb-6 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand"><UserRound className="h-5 w-5" /></span><h2 className="font-heading text-xl font-black text-navy dark:text-white">{copy.details}</h2></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={copy.name} full><input required minLength={3} value={form.name} onChange={(e) => update("name", e.target.value)} /></Field>
                  <Field label={copy.phone}><input required inputMode="numeric" pattern="01[0125][0-9]{8}" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
                  <Field label={copy.guardian}><input required inputMode="numeric" pattern="01[0125][0-9]{8}" value={form.guardianPhone} onChange={(e) => update("guardianPhone", e.target.value)} /></Field>
                  <Field label={copy.email} full><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
                  <Field label={copy.grade}><select value={form.grade} onChange={(e) => update("grade", e.target.value)}>{grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}</select></Field>
                  <Field label={copy.governorate}><select value={form.governorate} onChange={(e) => update("governorate", e.target.value)}>{governorates.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                </div>
                <button disabled={saving} className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-6 text-xs font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? copy.saving : copy.save}</button>
              </form>

              <form onSubmit={updatePassword} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
                <div className="mb-6 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500"><KeyRound className="h-5 w-5" /></span><h2 className="font-heading text-xl font-black text-navy dark:text-white">{copy.password}</h2></div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label={copy.current}><input required minLength={8} type="password" value={passwords.currentPassword} onChange={(e) => setPasswords((current) => ({ ...current, currentPassword: e.target.value }))} /></Field>
                  <Field label={copy.next}><input required minLength={8} type="password" value={passwords.newPassword} onChange={(e) => setPasswords((current) => ({ ...current, newPassword: e.target.value }))} /></Field>
                  <Field label={copy.confirm}><input required minLength={8} type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords((current) => ({ ...current, confirmPassword: e.target.value }))} /></Field>
                </div>
                <button disabled={saving} className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-navy px-6 text-xs font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60 dark:bg-brand"><KeyRound className="h-4 w-4" />{copy.change}</button>
              </form>
            </div>

            <aside className="h-fit rounded-[28px] bg-[#07111f] p-7 text-white shadow-[0_22px_60px_rgba(15,23,42,.2)] xl:sticky xl:top-24">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300"><ShieldCheck className="h-6 w-6" /></span>
              <h2 className="mt-5 font-heading text-xl font-black">{copy.protected}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{copy.protectedText}</p>
              <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                <p>{user?.phone}</p>
                <p>{user?.email || "—"}</p>
                <p>{user?.grade}</p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, full = false, children }: { label: string; full?: boolean; children: React.ReactElement<{ className?: string }> }) {
  const control = cloneElement(children, {
    className: `admin-input ${children.props.className ?? ""}`.trim(),
  });
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <span className="mb-2 block text-xs font-black text-navy dark:text-white">{label}</span>
      {control}
    </label>
  );
}
