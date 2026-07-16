import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WhatsAppButton({
  text = "تواصل عبر واتساب",
  message = "مرحبًا، أرغب في الاستفسار عن الكورسات المتاحة",
  className,
  variant = "solid",
}: {
  text?: string;
  message?: string;
  className?: string;
  variant?: "solid" | "outline";
}) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201158870645";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm transition-all duration-200",
        variant === "solid"
          ? "bg-success text-white hover:brightness-110 shadow-card hover:shadow-cardHover hover:-translate-y-0.5"
          : "border-2 border-success text-success hover:bg-success hover:text-white",
        className
      )}
    >
      <MessageCircle className="w-4 h-4" />
      {text}
    </a>
  );
}
