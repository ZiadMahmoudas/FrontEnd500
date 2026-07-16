import { cn } from "@/lib/utils";

export default function ProgressBar({
  value,
  className,
  showLabel = true,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-l from-brand to-brand-light transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 flex justify-between text-xs text-ink font-mono">
          <span>{clamped}%</span>
          <span>مكتمل</span>
        </div>
      )}
    </div>
  );
}
