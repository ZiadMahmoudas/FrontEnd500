import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BrandLogo({
  size = 48,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-2xl border border-amber-300/30 bg-[#020713] shadow-[0_10px_30px_rgba(6,26,66,.28)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo.jpg"
        alt="شعار منصة المهاجر - الثواني الأخيرة"
        fill
        priority={priority}
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}
