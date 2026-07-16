"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCirclePlay,
  faDownload,
  faArrowUpRightFromSquare,
  faFilePdf,
  faFilm,
  faLock,
  faPlay,
  faRotateRight,
  faShieldHalved,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LockedContentCard from "@/components/LockedContentCard";
import ProgressBar from "@/components/ProgressBar";
import { apiFetch, ApiError, getStoredToken, normalizeLocalMediaUrl } from "@/lib/api/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Lesson } from "@/lib/types";

interface LessonApiResponse {
  success: true;
  lesson: Lesson & { course_title?: string; course_slug?: string; course_price?: number };
  has_access: boolean;
}

interface LessonsResponse {
  success: true;
  lessons: Lesson[];
}

interface AccessResponse {
  success: true;
  url: string;
  fallback_url?: string;
  expires_in: number;
  source?: string;
  player?: "html5" | "iframe" | "document";
}

export default function LessonWatchPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const lessonId = String(params.id || "");
  const { user } = useAuth();
  const videoRef = useRef<HTMLDivElement | null>(null);
  const pdfRef = useRef<HTMLDivElement | null>(null);

  const [lesson, setLesson] = useState<LessonApiResponse["lesson"] | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFallbackUrl, setVideoFallbackUrl] = useState("");
  const [videoPlayer, setVideoPlayer] = useState<"html5" | "iframe">("html5");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [playerError, setPlayerError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadLesson = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    setPageError("");
    setPlayerError("");
    setVideoUrl("");
    setVideoFallbackUrl("");
    setPdfUrl("");
    setPdfOpen(false);

    try {
      const response = await apiFetch<LessonApiResponse>(`/lessons/${lessonId}`);
      setLesson(response.lesson);
      setHasAccess(response.has_access);

      const list = await apiFetch<LessonsResponse>(`/courses-id/${response.lesson.courseId}/lessons`);
      setCourseLessons(list.lessons);

      if (response.has_access && response.lesson.hasVideo && getStoredToken()) {
        try {
          const token = await apiFetch<AccessResponse>(`/lessons/${lessonId}/access-token`, {
            method: "POST",
            body: JSON.stringify({ type: "video" }),
          });
          const primaryUrl = normalizeLocalMediaUrl(token.url);
          const fallbackUrl = normalizeLocalMediaUrl(token.fallback_url || token.url);
          setVideoUrl(primaryUrl);
          setVideoFallbackUrl(fallbackUrl !== primaryUrl ? fallbackUrl : "");
          setVideoPlayer(token.player === "iframe" ? "iframe" : "html5");
        } catch (reason) {
          setPlayerError(reason instanceof ApiError ? reason.message : "تعذر تجهيز رابط الفيديو.");
        }
      }
    } catch (reason) {
      setPageError(reason instanceof ApiError ? reason.message : "تعذر تحميل بيانات الدرس.");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  useEffect(() => {
    if (!loading && searchParams.get("focus") === "pdf" && pdfRef.current) {
      window.setTimeout(() => pdfRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
  }, [loading, searchParams]);

  const ordered = useMemo(() => [...courseLessons].sort((a, b) => a.order - b.order), [courseLessons]);
  const currentIndex = ordered.findIndex((item) => item.id === lesson?.id);
  const prev = currentIndex > 0 ? ordered[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? ordered[currentIndex + 1] : null;

  async function openPdf() {
    if (!lesson || !lesson.hasPdf || !hasAccess || pdfLoading) return;
    setPdfLoading(true);
    setPlayerError("");

    try {
      const response = await apiFetch<AccessResponse>(`/lessons/${lesson.id}/access-token`, {
        method: "POST",
        body: JSON.stringify({ type: "pdf" }),
      });
      const readyUrl = normalizeLocalMediaUrl(response.fallback_url || response.url);
      setPdfUrl(readyUrl);
      setPdfOpen(true);
      window.setTimeout(() => pdfRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (reason) {
      setPlayerError(reason instanceof ApiError ? reason.message : "تعذر فتح الملزمة.");
    } finally {
      setPdfLoading(false);
    }
  }

  function openPdfInNewTab() {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  async function saveProgress(seconds: number, duration: number) {
    if (!lesson || !getStoredToken() || !duration) return;
    const percent = Math.min(100, Math.round((seconds / duration) * 100));
    setProgress(percent);
    if (percent % 10 === 0 || percent >= 95) {
      apiFetch(`/lessons/${lesson.id}/progress`, {
        method: "POST",
        body: JSON.stringify({ watched_seconds: Math.floor(seconds), completed: percent >= 95 }),
      }).catch(() => undefined);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb]">
        <Navbar />
        <div className="container-app py-24 text-center">
          <span className="inline-flex h-14 w-14 animate-spin items-center justify-center rounded-full border-4 border-brand/15 border-t-brand">
            <FontAwesomeIcon icon={faRotateRight} />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-500">جاري تجهيز الدرس...</p>
        </div>
      </div>
    );
  }

  if (pageError || !lesson) {
    return (
      <div className="min-h-screen bg-[#f4f7fb]">
        <Navbar />
        <div className="container-app py-20">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-rose-200 bg-white p-8 text-center shadow-card">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl text-rose-500" />
            <h1 className="mt-4 font-heading text-2xl font-black text-navy">تعذر فتح الدرس</h1>
            <p className="mt-3 text-sm font-bold leading-7 text-rose-600">{pageError || "الدرس غير موجود."}</p>
            <button onClick={loadLesson} className="mt-5 rounded-xl bg-brand px-5 py-3 text-xs font-black text-white">إعادة المحاولة</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const courseTitle = lesson.course_title || lesson.courseTitle || "الكورس";
  const courseSlug = lesson.course_slug || lesson.courseSlug || "";
  const coursePrice = lesson.course_price ?? lesson.coursePrice ?? 0;

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <Navbar />
      <section className="container-app py-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
          <Link href={`/courses/${courseSlug}`} className="hover:text-brand">{courseTitle}</Link>
          <span>/</span>
          <span className="text-navy">{lesson.title}</span>
        </div>

        <div className="mb-6 rounded-[24px] border border-white bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,.05)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-black text-brand">محتوى الدرس</p>
              <h1 className="mt-1 font-heading text-xl font-black text-navy">{lesson.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {lesson.hasVideo ? (
                <button onClick={() => videoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs font-black text-white">
                  <FontAwesomeIcon icon={faFilm} /> مشاهدة الفيديو
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-400">
                  <FontAwesomeIcon icon={faFilm} /> لا يوجد فيديو
                </span>
              )}
              {lesson.hasPdf ? (
                <button disabled={!hasAccess || pdfLoading} onClick={openPdf} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-black text-rose-600 disabled:cursor-not-allowed disabled:opacity-50">
                  <FontAwesomeIcon icon={faFilePdf} /> {pdfLoading ? "جاري فتح الملزمة..." : "فتح الملزمة PDF"}
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-400">
                  <FontAwesomeIcon icon={faFilePdf} /> لا توجد ملزمة
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-6">
            {hasAccess ? (
              lesson.hasVideo ? (
                <div ref={videoRef} className="scroll-mt-24 overflow-hidden rounded-[28px] bg-[#050a12] shadow-[0_26px_70px_rgba(15,23,42,.24)]">
                  <div className="relative aspect-video">
                    {videoUrl ? (
                      videoPlayer === "iframe" ? (
                        <iframe
                          src={videoUrl}
                          title={lesson.title}
                          className="h-full w-full border-0 bg-black"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      ) : (
                        <video
                          key={videoUrl}
                          src={videoUrl}
                          controls
                          preload="metadata"
                          controlsList="nodownload noplaybackrate"
                          disablePictureInPicture
                          className="h-full w-full bg-black object-contain"
                          onLoadedMetadata={() => setPlayerError("")}
                          onError={() => {
                            if (videoFallbackUrl && videoFallbackUrl !== videoUrl) {
                              setVideoUrl(videoFallbackUrl);
                              setVideoFallbackUrl("");
                              return;
                            }
                            setPlayerError("تعذر تشغيل ملف الفيديو. تأكد أن الملف اكتمل رفعه وأنه بصيغة MP4 أو WebM سليمة.");
                          }}
                          onTimeUpdate={(event) => saveProgress(event.currentTarget.currentTime, event.currentTarget.duration)}
                          onContextMenu={(event) => event.preventDefault()}
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,.22),transparent_40%),#050a12] p-8 text-center text-white">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-cyan-300"><FontAwesomeIcon icon={faPlay} /></span>
                        <p className="mt-5 font-heading text-lg font-black">{playerError || "جاري تجهيز الفيديو..."}</p>
                        <p className="mt-2 max-w-md text-xs leading-6 text-slate-400">لو استمرت الرسالة، افتح تعديل الدرس وتأكد أن الرفع وصل إلى 100% ثم احفظ الدرس. التشغيل المحلي أصبح من نفس PHP API على المنفذ 8080.</p>
                        <button onClick={loadLesson} className="mt-4 rounded-xl border border-white/15 px-4 py-2 text-xs font-black text-white">إعادة المحاولة</button>
                      </div>
                    )}
                    <div className="pointer-events-none absolute left-[7%] top-[12%] z-10 rounded-lg bg-black/35 px-3 py-1.5 font-mono text-[10px] text-white/45 backdrop-blur-sm">{user?.name || "طالب"} • {user?.phone || ""}</div>
                    <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-black/50 px-3 py-2 text-[10px] font-bold text-white/70 backdrop-blur"><FontAwesomeIcon icon={faShieldHalved} className="text-emerald-300" /> {videoPlayer === "iframe" ? "تشغيل من مزود الفيديو بعد التحقق من الاشتراك" : "رابط مشاهدة مؤقت ومحمي"}</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                  <FontAwesomeIcon icon={faFilm} className="text-4xl text-slate-300" />
                  <h2 className="mt-4 font-heading text-xl font-black text-navy">لا يوجد فيديو مرفوع لهذا الدرس</h2>
                  <p className="mt-2 text-sm text-slate-500">هذا الدرس قد يحتوي على ملزمة فقط. استخدم زر «فتح الملزمة PDF» الظاهر أعلى الصفحة.</p>
                </div>
              )
            ) : (
              <LockedContentCard price={coursePrice} courseTitle={courseTitle} />
            )}

            <article className="rounded-[28px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)] md:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-xs font-black text-brand">الدرس {String(lesson.order).padStart(2, "0")}</span>
                  <h2 className="mt-2 font-heading text-2xl font-black text-navy md:text-3xl">{lesson.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-500">{lesson.description || "لا يوجد شرح مكتوب لهذا الدرس بعد."}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-[10px] font-black text-slate-500"><FontAwesomeIcon icon={faCirclePlay} /> {lesson.durationMinutes} دقيقة</span>
              </div>
              {hasAccess && lesson.hasVideo && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black text-navy">تقدمك في الدرس</span><span className="font-mono text-xs font-black text-brand">{progress}%</span></div>
                  <ProgressBar value={progress} showLabel={false} />
                </div>
              )}
            </article>

            <div ref={pdfRef} className="scroll-mt-24">
              {lesson.hasPdf ? (
                <div className={`overflow-hidden rounded-[24px] border bg-white shadow-[0_10px_35px_rgba(15,23,42,.05)] ${searchParams.get("focus") === "pdf" ? "border-rose-300 ring-4 ring-rose-100" : "border-white"}`}>
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                      <FontAwesomeIcon icon={hasAccess ? faFilePdf : faLock} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-navy">ملزمة الدرس PDF</span>
                      <span className="mt-1 block text-xs text-slate-400">
                        {hasAccess ? "اعرض الملزمة داخل الصفحة أو افتحها في تبويب مستقل." : "متاحة بعد الاشتراك"}
                      </span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={!hasAccess || pdfLoading}
                        onClick={openPdf}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                        {pdfLoading ? "جاري تجهيز الملزمة..." : pdfOpen ? "إعادة تحميل الملزمة" : "عرض الملزمة هنا"}
                      </button>
                      {pdfUrl && (
                        <button
                          onClick={openPdfInNewTab}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-navy"
                        >
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                          فتح في تبويب
                        </button>
                      )}
                    </div>
                  </div>

                  {pdfOpen && pdfUrl && (
                    <div className="border-t border-slate-100 bg-slate-100 p-2 sm:p-4">
                      <iframe
                        key={pdfUrl}
                        src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                        title={`ملزمة ${lesson.title}`}
                        className="h-[70vh] min-h-[520px] w-full rounded-2xl border-0 bg-white"
                      />
                      <p className="mt-3 text-center text-[11px] font-bold text-slate-500">
                        لو المتصفح لم يعرض الـPDF داخل الصفحة، استخدم زر «فتح في تبويب» بالأعلى.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex w-full items-center gap-4 rounded-[24px] border border-dashed border-slate-200 bg-white p-5 text-right">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-300"><FontAwesomeIcon icon={faFilePdf} /></span>
                  <span><span className="block text-sm font-black text-navy">لا توجد ملزمة لهذا الدرس</span><span className="mt-1 block text-xs text-slate-400">يمكن للمدرس إضافتها لاحقًا من لوحة الإدارة.</span></span>
                </div>
              )}
            </div>

            {playerError && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-700">{playerError}</div>}

            <div className="flex items-center justify-between gap-3">
              {prev ? <Link href={`/lessons/${prev.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black text-navy"><FontAwesomeIcon icon={faArrowRight} /> الدرس السابق</Link> : <span />}
              {next ? <Link href={`/lessons/${next.id}`} className="inline-flex items-center gap-2 rounded-2xl bg-navy px-5 py-3 text-xs font-black text-white">الدرس التالي <FontAwesomeIcon icon={faArrowLeft} /></Link> : <span />}
            </div>
          </main>

          <aside className="h-fit rounded-[28px] border border-white bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,.06)] xl:sticky xl:top-24">
            <div className="flex items-center justify-between px-2 pb-4">
              <div><h2 className="font-heading text-lg font-black text-navy">محتوى الكورس</h2><p className="mt-1 text-[10px] text-slate-400">{ordered.length} دروس مرتبة</p></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand"><FontAwesomeIcon icon={faCirclePlay} /></span>
            </div>
            <div className="max-h-[640px] space-y-2 overflow-y-auto pl-1">
              {ordered.map((item, index) => {
                const unlocked = hasAccess || item.isFree;
                return (
                  <Link key={item.id} href={`/lessons/${item.id}`} className={`flex items-center gap-3 rounded-2xl border p-3 transition ${item.id === lesson.id ? "border-brand/20 bg-brand/[.05]" : "border-transparent hover:bg-slate-50"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-black ${item.id === lesson.id ? "bg-brand text-white" : "bg-slate-100 text-slate-500"}`}>{String(index + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1"><span className={`block truncate text-xs font-black ${item.id === lesson.id ? "text-brand" : "text-navy"}`}>{item.title}</span><span className="mt-1 block text-[10px] text-slate-400">{item.hasVideo ? "فيديو" : "بدون فيديو"}{item.hasPdf ? " • PDF" : ""}</span></span>
                    <FontAwesomeIcon icon={unlocked ? faCirclePlay : faLock} className={`h-3 w-3 ${unlocked ? "text-emerald-400" : "text-slate-300"}`} />
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
