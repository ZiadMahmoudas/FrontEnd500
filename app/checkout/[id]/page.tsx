"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBuildingColumns, faCheck, faCloudArrowUp, faGift, faLock, faReceipt, faShieldHalved, faSpinner, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faPaypal, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PayPalCheckoutButton from "@/components/PayPalCheckoutButton";
import RoleGuard from "@/components/auth/RoleGuard";
import { getCourseById } from "@/lib/api/courses";
import { enrollFreeCourse, getPaymentSettings, submitManualPayment, type PaymentSettings } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils";
import type { Course, PaymentMethod } from "@/lib/types";

type CheckoutMethod = Extract<PaymentMethod, "vodafone_cash" | "instapay" | "paypal" | "whatsapp" | "free">;

export default function CheckoutPage() {
  return <RoleGuard roles={["student"]}><CheckoutContent /></RoleGuard>;
}

function CheckoutContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [method, setMethod] = useState<CheckoutMethod>("vodafone_cash");
  const [transactionId, setTransactionId] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [transferredAt, setTransferredAt] = useState("");
  const [notes, setNotes] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    Promise.all([getCourseById(params.id), getPaymentSettings()])
      .then(([courseResponse, paymentSettings]) => {
        setCourse(courseResponse.course);
        setSettings(paymentSettings);
        if (courseResponse.course.status === "coming_soon") setError("هذا الكورس غير متاح للاشتراك بعد.");
        else setMethod(courseResponse.course.price === 0 ? "free" : "vodafone_cash");
      })
      .catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر تحميل بيانات الدفع."))
      .finally(() => setLoading(false));
  }, [params.id]);

  const whatsappMessage = useMemo(() => course ? encodeURIComponent(`مرحبًا، أرغب في تفعيل اشتراكي في كورس «${course.title}» بسعر ${formatPrice(course.price)}. رقم الكورس: ${course.id}`) : "", [course]);

  async function submitManual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!course || !["vodafone_cash", "instapay"].includes(method)) return;
    setSubmitting(true); setMessage(""); setError("");
    try {
      const data = new FormData();
      data.append("course_id", course.id);
      data.append("method", method);
      data.append("transaction_id", transactionId);
      data.append("payer_name", payerName);
      data.append("payer_phone", payerPhone);
      data.append("transferred_at", transferredAt);
      data.append("notes", notes);
      if (proof) data.append("proof", proof);
      const response = await submitManualPayment(data);
      setMessage(`${response.message} كود الطلب: ${response.order_code}`);
      setTransactionId(""); setProof(null); setNotes("");
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر إرسال إثبات الدفع.");
    } finally { setSubmitting(false); }
  }

  async function activateFree() {
    if (!course) return;
    setSubmitting(true); setError(""); setMessage("");
    try {
      const response = await enrollFreeCourse(Number(course.id));
      setMessage(response.message);
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "تعذر تفعيل الكورس المجاني."); }
    finally { setSubmitting(false); }
  }

  if (loading) return <div className="min-h-screen bg-[#f4f7fb]"><Navbar /><div className="flex min-h-[65vh] items-center justify-center gap-3 text-sm font-bold text-slate-500"><FontAwesomeIcon icon={faSpinner} spin className="text-brand" /> جاري تجهيز صفحة الدفع...</div><Footer /></div>;
  if (!course || !settings) return <div className="min-h-screen bg-[#f4f7fb]"><Navbar /><div className="container-app py-24"><div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-sm font-bold text-rose-600">{error || "تعذر العثور على الكورس."}</div></div><Footer /></div>;

  const methods: Array<{ key: CheckoutMethod; title: string; subtitle: string; icon: any }> = course.price === 0 ? [
    { key: "free", title: "اشتراك مجاني", subtitle: "تفعيل فوري للتجربة", icon: faGift },
  ] : [
    { key: "vodafone_cash", title: "فودافون كاش", subtitle: "تحويل ثم مراجعة", icon: faWallet },
    { key: "instapay", title: "InstaPay", subtitle: "تحويل بنكي لحظي", icon: faBuildingColumns },
    { key: "paypal", title: "PayPal", subtitle: "تفعيل تلقائي", icon: faPaypal },
    { key: "whatsapp", title: "واتساب", subtitle: "مساعدة من الإدارة", icon: faWhatsapp },
  ];

  const transferInfo = method === "instapay"
    ? { target: settings.instapay.ipa || settings.instapay.mobile, account: settings.instapay.account_name, label: settings.instapay.ipa ? "عنوان InstaPay (IPA)" : "رقم الموبايل المسجل على InstaPay" }
    : { target: settings.vodafone_cash.number, account: settings.vodafone_cash.account_name, label: "رقم محفظة فودافون كاش" };

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <Navbar />
      <section className="container-app py-10 md:py-14">
        <div className="mb-8"><span className="text-xs font-black text-brand">دفع موثق ومحفوظ في حسابك</span><h1 className="mt-2 font-heading text-3xl font-black text-navy">إتمام الاشتراك</h1><p className="mt-2 text-sm text-slate-500">كل طلب يأخذ كودًا فريدًا ويظهر للطالب والإدارة ويمكن تصديره لاحقًا إلى Excel.</p></div>
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
          <main className="space-y-6">
            <div className={`grid gap-3 ${methods.length === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-1"}`}>{methods.map((item) => <MethodCard key={item.key} active={method === item.key} onClick={() => { setMethod(item.key); setMessage(""); setError(""); }} icon={item.icon} title={item.title} subtitle={item.subtitle} />)}</div>

            {method === "free" && <div className="rounded-[28px] border border-white bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,.06)]"><div className="rounded-2xl bg-emerald-50 p-5"><FontAwesomeIcon icon={faGift} className="text-2xl text-emerald-600" /><h2 className="mt-3 font-heading text-xl font-black text-navy">جرّب المنصة مجانًا</h2><p className="mt-2 text-sm leading-7 text-slate-500">اضغط التفعيل وسيُسجل طلب بقيمة صفر ويُضاف الكورس فورًا إلى لوحة الطالب.</p></div><button onClick={activateFree} disabled={submitting} className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-black text-white disabled:opacity-60">{submitting ? "جاري التفعيل..." : "تفعيل الكورس المجاني"}<FontAwesomeIcon icon={faArrowLeft} /></button></div>}

            {(method === "vodafone_cash" || method === "instapay") && <form onSubmit={submitManual} className="rounded-[28px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.06)] md:p-7">
              <div className="flex items-start gap-3 rounded-2xl border border-brand/10 bg-brand/[.04] p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white"><FontAwesomeIcon icon={method === "instapay" ? faBuildingColumns : faWallet} /></span><div><p className="text-xs font-black text-slate-500">{transferInfo.label}</p><p dir="ltr" className="mt-1 text-right font-mono text-xl font-black text-navy">{transferInfo.target}</p><p className="mt-1 text-[11px] font-bold text-emerald-700">اسم الحساب المتوقع: {transferInfo.account}</p><p className="mt-1 text-[10px] leading-5 text-slate-400">قبل التأكيد تأكد أن التطبيق يعرض اسم الحساب المكتوب بالأعلى. الاسم الحقيقي يظهر من البنك أو المحفظة ولا يحدده الموقع.</p></div></div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="اسم صاحب التحويل"><input required value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="الاسم كما يظهر في التحويل" /></Field>
                <Field label="رقم صاحب التحويل"><input required dir="ltr" pattern="01[0125][0-9]{8}" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} placeholder="01xxxxxxxxx" /></Field>
                <Field label="رقم العملية / المرجع"><input required dir="ltr" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="اكتب الرقم الموجود في الإيصال" /></Field>
                <Field label="وقت التحويل"><input type="datetime-local" value={transferredAt} onChange={(e) => setTransferredAt(e.target.value)} /></Field>
                <label className="md:col-span-2"><span className="mb-2 block text-xs font-black text-navy">صورة الإيصال</span><span className="flex h-[58px] cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-xs font-bold text-slate-500 transition hover:border-brand/40 hover:bg-brand/[.03]"><FontAwesomeIcon icon={faCloudArrowUp} className="text-brand" />{proof ? proof.name : "اختر صورة أو PDF للإيصال"}<input required type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="hidden" onChange={(event) => setProof(event.target.files?.[0] || null)} /></span></label>
                <label className="md:col-span-2"><span className="mb-2 block text-xs font-black text-navy">ملاحظات اختيارية</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-brand/40" placeholder="مثال: التحويل تم من رقم ولي الأمر" /></label>
              </div>
              <button disabled={submitting} className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand to-blue-600 text-sm font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.22)] disabled:opacity-60">{submitting ? "جاري تسجيل العملية..." : "تسجيل الدفع وإرسال الإيصال"}<FontAwesomeIcon icon={faArrowLeft} /></button>
            </form>}

            {method === "paypal" && <div className="rounded-[28px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.06)] md:p-7"><div className="mb-6 flex items-start gap-3 rounded-2xl bg-[#f2f8ff] p-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0070ba] text-white"><FontAwesomeIcon icon={faPaypal} /></span><div><p className="text-sm font-black text-navy">PayPal — {settings.paypal.mode === "sandbox" ? "وضع الاختبار Sandbox" : "وضع Live"}</p><p className="mt-1 text-xs leading-6 text-slate-500">السيرفر ينشئ الطلب، يتحقق من القيمة والعملة، ثم يفعّل الكورس بعد Capture أو Webhook موثوق.</p><p className="mt-1 text-[11px] font-black text-brand">القيمة: {course.paypalPrice?.toFixed(2) || "0.00"} {settings.paypal.currency}</p></div></div><PayPalCheckoutButton courseId={Number(course.id)} onSuccess={() => router.push("/dashboard")} /></div>}

            {method === "whatsapp" && <div className="rounded-[28px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.06)] md:p-7"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white"><FontAwesomeIcon icon={faWhatsapp} /></span><div><p className="text-sm font-black text-navy">محتاج مساعدة في الاشتراك؟</p><p className="mt-1 text-xs text-slate-500">الرسالة جاهزة باسم الكورس والسعر.</p></div></div><div className="mt-4 rounded-xl bg-white p-4 text-xs leading-7 text-slate-600">مرحبًا، أرغب في تفعيل اشتراكي في كورس «{course.title}» بسعر {formatPrice(course.price)}.</div></div><a href={`https://wa.me/${settings.whatsapp.number}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="mt-5 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-black text-white"><FontAwesomeIcon icon={faWhatsapp} /> فتح المحادثة على واتساب</a></div>}

            {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{message}</div>}
            {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-600">{error}</div>}
            <div className="grid gap-3 sm:grid-cols-3">{[[faShieldHalved,"بياناتك محمية"],[faLock,"المحتوى للمشترك فقط"],[faReceipt,"كل عملية لها كود"]].map(([icon,label]) => <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-black text-navy"><FontAwesomeIcon icon={icon as any} className="text-brand" />{label as string}</div>)}</div>
          </main>

          <aside className="h-fit lg:sticky lg:top-24"><div className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_18px_55px_rgba(15,23,42,.09)]"><div className="relative aspect-[16/9]"><Image src={course.image} alt={course.title} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" /><span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-navy">{course.grade}</span></div><div className="p-6"><p className="text-xs font-black text-brand">اشتراك كورس كامل</p><h2 className="mt-2 font-heading text-xl font-black leading-8 text-navy">{course.title}</h2><div className="mt-5 space-y-3 border-y border-slate-100 py-5 text-xs text-slate-500">{[`${course.lessonsCount} درس فيديو`,"ملازم PDF محمية","تقدم محفوظ في الحساب","سجل دفع داخل الداشبورد"].map((item) => <div key={item} className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><FontAwesomeIcon icon={faCheck} className="h-2.5 w-2.5" /></span>{item}</div>)}</div><div className="mt-5 flex items-center justify-between"><span className="text-sm font-bold text-slate-500">الإجمالي</span><strong className="font-heading text-2xl font-black text-navy">{formatPrice(course.price)}</strong></div></div></div></aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function MethodCard({ active, onClick, icon, title, subtitle }: { active: boolean; onClick: () => void; icon: any; title: string; subtitle: string }) {
  return <button onClick={onClick} className={`rounded-2xl border p-4 text-right transition ${active ? "border-brand bg-brand/[.05] shadow-[0_8px_24px_rgba(37,99,235,.09)]" : "border-slate-200 bg-white hover:border-brand/30"}`}><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-brand text-white" : "bg-slate-100 text-slate-500"}`}><FontAwesomeIcon icon={icon} /></span><strong className="mt-3 block text-sm text-navy">{title}</strong><span className="mt-1 block text-[10px] text-slate-400">{subtitle}</span></button>;
}

function Field({ label, children }: { label: string; children: React.ReactElement }) {
  return <label><span className="mb-2 block text-xs font-black text-navy">{label}</span><span className="block [&>input]:h-[52px] [&>input]:w-full [&>input]:rounded-2xl [&>input]:border [&>input]:border-slate-200 [&>input]:bg-slate-50 [&>input]:px-4 [&>input]:text-sm [&>input]:outline-none [&>input]:focus:border-brand/40 [&>input]:focus:bg-white">{children}</span></label>;
}
