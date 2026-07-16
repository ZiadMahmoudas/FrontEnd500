import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Users, Star, Clock3 } from "lucide-react";
import type { Course } from "@/lib/types";
import { formatPrice, formatNumber } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export default function CourseCard({ course }: { course: Course }) {
  const comingSoon = course.status === "coming_soon";
  const content = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={course.image} alt={course.title} fill sizes="(max-width: 768px) 100vw, 400px" className={`object-cover transition-transform duration-500 group-hover:scale-105 ${comingSoon ? "grayscale-[.35]" : ""}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/0 to-navy/0" />
        <div className="absolute right-3 top-3 flex gap-2">
          {comingSoon && <StatusBadge label="قريبًا" tone="warning" dot={false} />}
          {!comingSoon && course.isNew && <StatusBadge label="جديد" tone="brand" dot={false} />}
          {!comingSoon && course.price === 0 && <StatusBadge label="مجاني" tone="success" dot={false} />}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-lg bg-navy/70 px-2.5 py-1 font-mono text-xs text-white backdrop-blur">
            {comingSoon ? <Clock3 className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}
            {comingSoon ? "يتم التجهيز" : `${course.lessonsCount} درس`}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="font-mono text-[11px] tracking-wide text-brand">{course.grade}</span>
        <h3 className="line-clamp-2 font-heading text-lg font-bold leading-snug text-navy transition-colors group-hover:text-brand">{course.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink">{course.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-3 font-mono text-xs text-ink">
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{formatNumber(course.studentsCount)}</span>
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{course.rating}</span>
          </div>
          <span className="font-heading font-extrabold text-navy">{comingSoon ? "قريبًا" : formatPrice(course.price)}</span>
        </div>
      </div>
    </>
  );

  if (comingSoon) return <article className="group card-surface flex cursor-not-allowed flex-col overflow-hidden opacity-90">{content}</article>;
  return <Link href={`/courses/${course.slug}`} className="group card-surface flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cardHover">{content}</Link>;
}
