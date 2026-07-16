"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LogIn, QrCode, ShieldCheck, TriangleAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Course, Lesson } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface QrResponse {
  success: true;
  code: string;
  target_type: "course" | "lesson" | "pdf";
  target: Course | Lesson;
  target_url: string;
  has_access: boolean;
}

export default function QRSubscriptionPage() {
  const params = useParams<{ code: string }>();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<QrResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = String(params.code || "");
    if (!code) return;
    setLoading(true);
    apiFetch<QrResponse>(`/qrcodes/${encodeURIComponent(code)}`)
      .then(setData)
      .catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر فتح رمز QR."))
      .finally(() => setLoading(false));
  }, [params.code, user]);

  const course = data?.target_type === "course" ? (data.target as Course) : null;
  const lesson = data && data.target_type !== "course" ? (data.target as Lesson) : null;
  const title = course?.title || lesson?.title || "محتوى تعليمي";

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <section className="container-app max-w-xl py-14">
        <div className="card-surface overflow-hidden">
          <div className="flex flex-col items-center gap-3 bg-mesh-navy p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-brand-light"><QrCode className="h-7 w-7" /></span>
            <p className="font-mono text-xs text-slate-400">كود المسح: {String(params.code || "")}</p>
            <h1 className="font-heading text-xl font-extrabold text-white">{title}</h1>
          </div>

          <div className="p-6">
            {(loading || authLoading) && <p className="py-8 text-center text-sm font-bold text-slate-500">جاري التحقق من الرمز والحساب...</p>}

            {!loading && error && (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <TriangleAlert className="h-8 w-8 text-rose-500" />
                <p className="font-bold text-rose-600">{error}</p>
              </div>
            )}

            {!loading && data && !user && (
              <div className="flex flex-col items-center gap-4 text-center">
                <LogIn className="h-8 w-8 text-brand" />
                <p className="font-heading font-bold text-navy">سجّل الدخول للمتابعة</p>
                <p className="text-sm text-ink">يجب تسجيل الدخول أو إنشاء حساب للوصول للمحتوى المرتبط بالرمز.</p>
                <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
                  <Link href={`/login?next=${encodeURIComponent(`/qr/${params.code}`)}`} className="flex-1 rounded-xl bg-brand py-3 text-center text-sm font-bold text-white">تسجيل الدخول</Link>
                  <Link href="/register" className="flex-1 rounded-xl border-2 border-navy py-3 text-center text-sm font-bold text-navy">إنشاء حساب</Link>
                </div>
              </div>
            )}

            {!loading && data && user && data.has_access && (
              <div className="flex flex-col items-center gap-4 text-center">
                <ShieldCheck className="h-9 w-9 text-success" />
                <p className="font-heading font-bold text-navy">المحتوى متاح في حسابك 🎉</p>
                <Link href={data.target_url} className="inline-flex items-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-bold text-white">
                  فتح المحتوى <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            )}

            {!loading && data && user && !data.has_access && course && (
              <div className="flex flex-col gap-4 text-center">
                <p className="font-heading font-bold text-navy">الكورس غير مفعل في حسابك بعد</p>
                <p className="text-sm text-ink">اختر طريقة الدفع من صفحة الاشتراك، وبعد الاعتماد سيفتح المحتوى تلقائيًا.</p>
                <strong className="font-heading text-2xl text-navy">{formatPrice(course.price)}</strong>
                <Link href={`/checkout/${course.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white">
                  الانتقال للدفع <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            )}

            {!loading && data && user && !data.has_access && lesson && (
              <div className="flex flex-col gap-4 text-center">
                <p className="font-heading font-bold text-navy">يجب تفعيل الكورس أولًا</p>
                <Link href={lesson.courseSlug ? `/courses/${lesson.courseSlug}` : "/courses"} className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white">عرض الكورس</Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
