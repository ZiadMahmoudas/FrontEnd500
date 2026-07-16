import Link from "next/link";
import { Clock, FileText, Lock, PlayCircle, Video } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function LessonItem({
  lesson,
  index,
  isSubscribed,
}: {
  lesson: Lesson;
  index: number;
  isSubscribed?: boolean;
}) {
  const unlocked = lesson.isFree || isSubscribed;
  const hasAnyContent = lesson.hasVideo || lesson.hasPdf;

  return (
    <article
      className={cn(
        "group rounded-2xl border p-4 transition-all duration-200",
        unlocked
          ? "border-slate-100 bg-white hover:border-brand/30 hover:shadow-card"
          : "border-slate-100 bg-slate-50/70",
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Link href={`/lessons/${lesson.id}`} className="flex min-w-0 flex-1 items-center gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-black",
              unlocked ? "bg-brand/10 text-brand" : "bg-slate-200 text-ink",
            )}
          >
            {String(index).padStart(2, "0")}
          </div>

          <div className="min-w-0 flex-1">
            <p className={cn("font-heading text-sm font-black md:text-base", unlocked ? "text-navy" : "text-ink")}>{lesson.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-ink">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                <Clock className="h-3.5 w-3.5" />
                {lesson.durationMinutes} دقيقة
              </span>
              {lesson.hasVideo && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                  <Video className="h-3.5 w-3.5" /> فيديو متاح
                </span>
              )}
              {lesson.hasPdf && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-rose-600">
                  <FileText className="h-3.5 w-3.5" /> ملزمة PDF
                </span>
              )}
              {lesson.isFree && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600">درس مجاني</span>}
              {!hasAnyContent && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">المحتوى لم يُرفع بعد</span>}
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
          {!unlocked ? (
            <Link href={`/lessons/${lesson.id}`} className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-xs font-black text-slate-600">
              <Lock className="h-4 w-4" /> يتطلب اشتراكًا
            </Link>
          ) : (
            <>
              {lesson.hasVideo && (
                <Link href={`/lessons/${lesson.id}`} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:brightness-110">
                  <PlayCircle className="h-4 w-4" /> مشاهدة الفيديو
                </Link>
              )}
              {lesson.hasPdf && (
                <Link href={`/lessons/${lesson.id}?focus=pdf`} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-black text-rose-600 transition hover:bg-rose-100">
                  <FileText className="h-4 w-4" /> فتح الملزمة
                </Link>
              )}
              {!hasAnyContent && (
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-black text-slate-400">قريبًا</span>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
