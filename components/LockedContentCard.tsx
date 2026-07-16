import { Lock, Smartphone, QrCode } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";

export default function LockedContentCard({
  price,
  courseTitle,
}: {
  price: number;
  courseTitle: string;
}) {
  return (
    <div className="code-window relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-lines bg-[size:24px_24px] opacity-30" />
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-brand-light/20">
          <Lock className="h-7 w-7 text-brand-light" />
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-xl text-white">هذا المحتوى مقفول</h3>
          <p className="mt-1 text-sm text-slate-400">
            اشترك الآن للوصول إلى «{courseTitle}» كاملًا
          </p>
        </div>
        <span className="font-mono text-3xl font-extrabold text-brand-light">
          {formatPrice(price)}
        </span>

        <div className="mt-2 grid w-full max-w-md gap-3 text-start">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
            <div>
              <p className="font-bold text-sm text-white">الدفع عبر فودافون كاش</p>
              <p className="mt-1 text-xs text-slate-400 font-mono">
                حوّل على الرقم: 010•• ••• 456 ثم أرسل رقم العملية
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <QrCode className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
            <div>
              <p className="font-bold text-sm text-white">اشترك عبر QR Code</p>
              <p className="mt-1 text-xs text-slate-400">
                امسح كود الاشتراك المتاح في المركز التعليمي لتفعيل الوصول فورًا
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <button className="flex-1 rounded-xl bg-brand py-3 font-bold text-sm text-white transition hover:brightness-110">
            الدفع عبر PayPal
          </button>
          <WhatsAppButton className="flex-1" text="فعّل عبر واتساب" />
        </div>
      </div>
    </div>
  );
}
