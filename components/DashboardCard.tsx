import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function DashboardCard({
  icon: Icon,
  label,
  value,
  tone = "brand",
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "brand" | "success" | "warning" | "navy";
  hint?: string;
}) {
  const toneMap = {
    brand: "bg-brand/10 text-brand",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    navy: "bg-navy/10 text-navy",
  };
  return (
    <div className="card-surface p-5 flex items-center gap-4">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", toneMap[tone])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink font-medium">{label}</p>
        <p className="font-heading font-extrabold text-2xl text-navy font-feature-num truncate">
          {value}
        </p>
        {hint && <p className="text-[11px] text-ink mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}
