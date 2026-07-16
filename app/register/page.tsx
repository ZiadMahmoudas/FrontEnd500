"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faEnvelope, faGraduationCap, faLocationDot, faLock, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import BrandLogo from "@/components/BrandLogo";

const grades = ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"];
const governorates = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "الغربية", "أسيوط", "سوهاج", "المنيا", "قنا", "أسوان"];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", grade: grades[2], governorate: governorates[0] });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#07111f] lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <Image src="/brand/cover.png" alt="الأستاذ محمود المهاجر - منصة الثواني الأخيرة" fill priority sizes="(max-width: 1024px) 0px, 55vw" className="object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#07111f]/20 via-[#07111f]/45 to-[#07111f]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Link href="/" className="flex items-center gap-3"><BrandLogo size={56} priority /><div><p className="font-heading text-2xl font-black">المهاجر</p><p className="text-[10px] font-bold text-amber-300">الثواني الأخيرة • رحلتك تبدأ هنا</p></div></Link>
          <div className="max-w-lg"><h1 className="font-heading text-5xl font-black leading-[1.35]">اعمل حسابك، واكتب أول سطر كود النهارده.</h1><div className="mt-8 space-y-4">{["دروس مجانية تبدأ بها فورًا", "تقدم محفوظ على كل أجهزتك", "ملازم واختبارات داخل كل كورس"].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300"><FontAwesomeIcon icon={faCheck} className="h-3 w-3" /></span>{item}</div>)}</div></div>
          <p className="text-xs text-slate-500">منصة تعليمية آمنة ومصممة للثانوية العامة</p>
        </div>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,.28),transparent_35%),radial-gradient(circle_at_0%_100%,rgba(34,211,238,.1),transparent_35%)] lg:hidden" />
        <div className="relative w-full max-w-2xl">
          <Link href="/" className="mb-7 flex items-center justify-center gap-3 lg:hidden"><BrandLogo size={54} priority /><span className="font-heading text-xl font-black text-white">المهاجر</span></Link>
          <div className="rounded-[30px] bg-white p-6 shadow-[0_35px_90px_rgba(0,0,0,.28)] sm:p-8">
            <div><span className="text-xs font-black text-brand">انضم مجانًا</span><h2 className="mt-2 font-heading text-3xl font-black text-navy">إنشاء حساب طالب</h2><p className="mt-2 text-sm text-slate-500">املأ البيانات التالية، وبعدها تقدر تشاهد الدروس المجانية فورًا.</p></div>
            {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-bold text-rose-600">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="الاسم بالكامل" icon={faUser} className="sm:col-span-2"><input required minLength={3} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="اكتب اسم الطالب بالكامل" /></Field>
              <Field label="رقم الهاتف" icon={faPhone}><input required pattern="01[0125][0-9]{8}" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="01xxxxxxxxx" /></Field>
              <Field label="البريد الإلكتروني (اختياري)" icon={faEnvelope}><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="student@mail.com" /></Field>
              <Field label="كلمة المرور" icon={faLock} className="sm:col-span-2"><input required minLength={8} type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="8 أحرف على الأقل" /></Field>
              <Field label="الصف الدراسي" icon={faGraduationCap}><select value={form.grade} onChange={(e) => update("grade", e.target.value)}>{grades.map((grade) => <option key={grade}>{grade}</option>)}</select></Field>
              <Field label="المحافظة" icon={faLocationDot}><select value={form.governorate} onChange={(e) => update("governorate", e.target.value)}>{governorates.map((governorate) => <option key={governorate}>{governorate}</option>)}</select></Field>
              <label className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500"><input required type="checkbox" className="mt-1 accent-brand" /> أوافق على شروط الاستخدام وسياسة الخصوصية، وأقر بأن البيانات صحيحة.</label>
              <button disabled={loading} className="sm:col-span-2 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand to-blue-600 text-sm font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.24)] transition hover:-translate-y-0.5 disabled:opacity-60">{loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب والبدء"}<FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" /></button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">لديك حساب بالفعل؟ <Link href="/login" className="font-black text-brand">سجّل دخولك</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, className = "", children }: { label: string; icon: any; className?: string; children: React.ReactElement }) {
  return <label className={className}><span className="mb-2 block text-xs font-black text-navy">{label}</span><span className="relative block"><FontAwesomeIcon icon={icon} className="absolute right-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />{children && <span className="[&>input]:h-[52px] [&>input]:w-full [&>input]:rounded-2xl [&>input]:border [&>input]:border-slate-200 [&>input]:bg-slate-50 [&>input]:pr-11 [&>input]:pl-4 [&>input]:text-sm [&>input]:outline-none [&>input]:transition [&>input]:focus:border-brand/40 [&>input]:focus:bg-white [&>input]:focus:ring-4 [&>input]:focus:ring-brand/5 [&>select]:h-[52px] [&>select]:w-full [&>select]:appearance-none [&>select]:rounded-2xl [&>select]:border [&>select]:border-slate-200 [&>select]:bg-slate-50 [&>select]:pr-11 [&>select]:pl-4 [&>select]:text-sm [&>select]:outline-none [&>select]:focus:border-brand/40">{children}</span>}</span></label>;
}
