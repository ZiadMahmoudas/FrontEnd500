"use client";

import { cn } from "@/lib/utils";
import { Smartphone, CreditCard, MessageCircle, Check } from "lucide-react";

const icons = {
  vodafone_cash: Smartphone,
  paypal: CreditCard,
  whatsapp: MessageCircle,
};

export default function PaymentMethodCard({
  method,
  title,
  description,
  selected,
  onSelect,
}: {
  method: "vodafone_cash" | "paypal" | "whatsapp";
  title: string;
  description: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const Icon = icons[method];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border-2 p-4 text-start transition-all",
        selected
          ? "border-brand bg-brand/5 shadow-card"
          : "border-slate-100 bg-white hover:border-slate-200"
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-brand text-white" : "bg-slate-100 text-ink"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-heading font-bold text-sm text-navy">{title}</p>
        <p className="mt-0.5 text-xs text-ink leading-relaxed">{description}</p>
      </div>
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-brand bg-brand" : "border-slate-300"
        )}
      >
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>
    </button>
  );
}
