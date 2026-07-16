"use client";

import { Play, Volume2, Maximize, Settings } from "lucide-react";

export default function VideoPlayerMock({
  title,
  studentName = "يوسف أحمد",
  studentPhone = "010•••••678",
}: {
  title: string;
  studentName?: string;
  studentPhone?: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-navy shadow-glow">
      {/* fake video surface */}
      <div className="absolute inset-0 bg-mesh-navy" />
      <div className="absolute inset-0 bg-grid-lines bg-[size:32px_32px] opacity-20" />

      {/* dynamic watermark — not a real video URL, protection placeholder */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-wrap content-around justify-around opacity-[0.18] select-none"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="font-mono text-xs text-white rotate-[-18deg]">
            {studentName} • {studentPhone}
          </span>
        ))}
      </div>

      {/* play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          aria-label="تشغيل"
          className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition hover:scale-105 hover:bg-white/20"
        >
          <Play className="h-7 w-7 md:h-8 md:w-8 text-white fill-white ms-1" />
        </button>
      </div>

      {/* controls bar */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-navy/90 to-transparent p-4">
        <div className="h-1 w-full rounded-full bg-white/20">
          <div className="h-full w-1/3 rounded-full bg-brand-light" />
        </div>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Play className="h-4 w-4" />
            <Volume2 className="h-4 w-4" />
            <span className="font-mono text-xs text-slate-300">04:12 / 12:30</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-300 truncate max-w-[160px]">
              {title}
            </span>
            <Settings className="h-4 w-4" />
            <Maximize className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
