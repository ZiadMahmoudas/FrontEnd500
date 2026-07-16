import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils";

export default function BrandIcon({
  icon,
  className,
  tone = "brand",
}: {
  icon: IconDefinition;
  className?: string;
  tone?: "brand" | "cyan" | "success" | "warning" | "danger" | "navy" | "white";
}) {
  const tones = {
    brand: "bg-brand/10 text-brand",
    cyan: "bg-cyan-400/10 text-cyan-500",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-rose-500/10 text-rose-500",
    navy: "bg-navy/10 text-navy",
    white: "bg-white/10 text-white",
  };

  return (
    <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", tones[tone], className)}>
      <FontAwesomeIcon icon={icon} className="h-5 w-5" />
    </span>
  );
}
