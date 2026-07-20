"use client";

import { FormEvent, cloneElement, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowRight, faCheck, faEnvelope, faGraduationCap, faLocationDot, faLock, faPhone, faUser, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const grades = [
  { value: "الأول الثانوي", ar: "الأول الثانوي", en: "First Secondary Grade" },
  { value: "الثاني الثانوي", ar: "الثاني الثانوي", en: "Second Secondary Grade" },
  { value: "الثالث الثانوي", ar: "الثالث الثانوي", en: "Third Secondary Grade" },
];
const governorates = [
  ["القاهرة", "Cairo"], ["الجيزة", "Giza"], ["الإسكندرية", "Alexandria"], ["الدقهلية", "Dakahlia"],
  ["الشرقية", "Sharqia"], ["الغربية", "Gharbia"], ["أسيوط", "Assiut"], ["سوهاج", "Sohag"],
  ["المنيا", "Minya"], ["قنا", "Qena"], ["أسوان", "Aswan"],
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { isEnglish } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", guardianPhone: "", email: "", password: "", grade: grades[2].value, governorate: governorates[0][0] });

  const copy = useMemo(() => isEnglish ? {
    brand: "Elmohager", tagline: "The Final Seconds • Your journey starts here",
    hero: "Create your account and write your first line of code today.",
    benefits: ["Start with free lessons immediately", "Your progress is saved across devices", "Notes and tests inside every course"],
    safe: "A secure learning platform built for secondary students", badge: "Join for free", title: "Create Student Account",
    subtitle: "Complete the details below, then start watching free lessons immediately.", name: "Student Full Name",
    namePlaceholder: "Enter the student's full name", phone: "Student Phone Number", guardian: "Parent / Guardian Phone Number",
    guardianPlaceholder: "Must be different from student phone", email: "Email (Optional)", password: "Password",
    passwordPlaceholder: "At least 8 characters", grade: "Grade", governorate: "Governorate",
    agreement: "I agree to the Terms of Use and Privacy Policy, and confirm that the submitted information is correct.",
    submit: "Create Account and Start", submitting: "Creating Account...", existing: "Already have an account?", login: "Sign in",
    different: "The parent or guardian phone number must be different from the student phone number.", fallback: "Unable to create the account right now.",
  } : {
    brand: "المهاجر", tagline: "الثواني الأخيرة • رحلتك تبدأ هنا",
    hero: "اعمل حسابك، واكتب أول سطر كود النهارده.",
    benefits: ["دروس مجانية تبدأ بها فورًا", "تقدم محفوظ على كل أجهزتك", "ملازم واختبارات داخل كل كورس"],
    safe: "منصة تعليمية آمنة ومصممة للثانوية العامة", badge: "انضم مجانًا", title: "إنشاء حساب طالب",
    subtitle: "املأ البيانات التالية، وبعدها تقدر تشاهد الدروس المجانية فورًا.", name: "الاسم بالكامل",
    namePlaceholder: "اكتب اسم الطالب بالكامل", phone: "رقم هاتف الطالب", guardian: "رقم هاتف ولي الأمر",
    guardianPlaceholder: "رقم مختلف عن رقم الطالب", email: "البريد الإلكتروني (اختياري)", password: "كلمة المرور",
    passwordPlaceholder: "8 أحرف على الأقل", grade: "الصف الدراسي", governorate: "المحافظة",
    agreement: "أوافق على شروط الاستخدام وسياسة الخصوصية، وأقر بأن البيانات صحيحة.",
    submit: "إنشاء الحساب والبدء", submitting: "جاري إنشاء الحساب...", existing: "لديك حساب بالفعل؟", login: "سجّل دخولك",
    different: "رقم ولي الأمر يجب أن يكون مختلفًا عن رقم الطالب.", fallback: "تعذر إنشاء الحساب حاليًا.",
  }, [isEnglish]);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (form.phone === form.guardianPhone) {
      setError(copy.different);
      return;
    }
    setLoading(true);
    try {
      await register(form);
      router.push("/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : copy.fallback);
    } finally {
      setLoading(false);
    }
  }

  const Arrow = isEnglish ? faArrowRight : faArrowLeft;

  return (
    <main data-no-translate className="relative grid min-h-screen bg-[#07111f] lg:grid-cols-[.9fr_1.1fr]">
      <div className="absolute end-4 top-4 z-30 flex items-center gap-2"><ThemeToggle compact dark /><LanguageSwitcher compact dark /></div>
      <section className="relative hidden overflow-hidden lg:block">
        <Image src="/brand/cover.png" alt={copy.brand} fill priority sizes="(max-width: 1024px) 0px, 55vw" className="object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#07111f]/20 via-[#07111f]/45 to-[#07111f]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Link href="/" className="flex items-center gap-3"><BrandLogo size={56} priority /><div><p className="font-heading text-2xl font-black">{copy.brand}</p><p className="text-[10px] font-bold text-amber-300">{copy.tagline}</p></div></Link>
          <div className="max-w-lg"><h1 className="font-heading text-5xl font-black leading-[1.35]">{copy.hero}</h1><div className="mt-8 space-y-4">{copy.benefits.map((item) => <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300"><FontAwesomeIcon icon={faCheck} className="h-3 w-3" /></span>{item}</div>)}</div></div>
          <p className="text-xs text-slate-500">{copy.safe}</p>
        </div>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden px-4 py-20 sm:px-8 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,.28),transparent_35%),radial-gradient(circle_at_0%_100%,rgba(34,211,238,.1),transparent_35%)] lg:hidden" />
        <div className="relative w-full max-w-2xl">
          <Link href="/" className="mb-7 flex items-center justify-center gap-3 lg:hidden"><BrandLogo size={54} priority /><span className="font-heading text-xl font-black text-white">{copy.brand}</span></Link>
          <div className="rounded-[30px] border border-white/10 bg-white p-6 shadow-[0_35px_90px_rgba(0,0,0,.28)] dark:bg-slate-900 sm:p-8">
            <div><span className="text-xs font-black text-brand">{copy.badge}</span><h1 className="mt-2 font-heading text-3xl font-black text-navy dark:text-white">{copy.title}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{copy.subtitle}</p></div>
            {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-bold text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label={copy.name} icon={faUser} className="sm:col-span-2"><input required minLength={3} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={copy.namePlaceholder} /></Field>
              <Field label={copy.phone} icon={faPhone}><input required inputMode="numeric" pattern="01[0125][0-9]{8}" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="01xxxxxxxxx" /></Field>
              <Field label={copy.guardian} icon={faUserShield}><input required inputMode="numeric" pattern="01[0125][0-9]{8}" value={form.guardianPhone} onChange={(e) => update("guardianPhone", e.target.value)} placeholder={copy.guardianPlaceholder} /></Field>
              <Field label={copy.email} icon={faEnvelope}><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="student@mail.com" /></Field>
              <Field label={copy.password} icon={faLock} className="sm:col-span-2"><input required minLength={8} type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder={copy.passwordPlaceholder} /></Field>
              <Field label={copy.grade} icon={faGraduationCap}><select value={form.grade} onChange={(e) => update("grade", e.target.value)}>{grades.map((item) => <option key={item.value} value={item.value}>{isEnglish ? item.en : item.ar}</option>)}</select></Field>
              <Field label={copy.governorate} icon={faLocationDot}><select value={form.governorate} onChange={(e) => update("governorate", e.target.value)}>{governorates.map(([ar, en]) => <option key={ar} value={ar}>{isEnglish ? en : ar}</option>)}</select></Field>
              <label className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500 dark:bg-slate-800 dark:text-slate-300"><input required type="checkbox" className="mt-1 accent-brand" /> {copy.agreement}</label>
              <button disabled={loading} className="sm:col-span-2 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand to-blue-600 text-sm font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.24)] transition hover:-translate-y-0.5 disabled:opacity-60">{loading ? copy.submitting : copy.submit}<FontAwesomeIcon icon={Arrow} className="h-3.5 w-3.5" /></button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{copy.existing} <Link href="/login" className="font-black text-brand">{copy.login}</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, className = "", children }: { label: string; icon: IconDefinition; className?: string; children: React.ReactElement<{ className?: string }> }) {
  const control = cloneElement(children, {
    className: `admin-input ps-11 ${children.props.className ?? ""}`.trim(),
  });
  return <label className={className}><span className="mb-2 block text-xs font-black text-navy dark:text-white">{label}</span><span className="relative block"><FontAwesomeIcon icon={icon} className="absolute start-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />{control}</span></label>;
}
