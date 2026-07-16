"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AdminModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  widthClass = "max-w-3xl",
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`max-h-[94vh] w-full overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_35px_100px_rgba(2,6,23,.35)] ${widthClass}`}>
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 md:px-7">
          <div>
            <h2 className="font-heading text-lg font-black text-navy md:text-xl">{title}</h2>
            {subtitle && <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500" aria-label="إغلاق">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>
        <div className="max-h-[calc(94vh-82px)] overflow-y-auto p-5 md:p-7">{children}</div>
      </section>
    </div>
  );
}
