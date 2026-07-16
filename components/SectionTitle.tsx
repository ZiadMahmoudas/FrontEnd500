import { cn } from "@/lib/utils";

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-start"
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full border",
            light
              ? "border-brand-light/30 text-brand-light bg-brand-light/5"
              : "border-brand/20 text-brand bg-brand/5"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-heading font-extrabold text-3xl md:text-4xl text-balance",
          light ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base md:text-lg",
            light ? "text-slate-300" : "text-ink",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
