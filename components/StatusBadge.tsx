import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "brand";

const toneStyles: Record<Tone, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-red-500/10 text-red-500 border-red-500/20",
  neutral: "bg-slate-200/60 text-ink border-slate-300/60",
  brand: "bg-brand/10 text-brand border-brand/20",
};

export default function StatusBadge({
  label,
  tone = "neutral",
  dot = true,
}: {
  label: string;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold font-mono",
        toneStyles[tone]
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}
