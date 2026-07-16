import Image from "next/image";
import { Download, Link as LinkIcon, ScanLine } from "lucide-react";
import type { QRCode } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

const typeLabel: Record<QRCode["targetType"], string> = {
  course: "كورس",
  lesson: "درس",
  pdf: "ملزمة PDF",
};

export default function QRCodeCard({ qr }: { qr: QRCode }) {
  return (
    <div className="card-surface p-5 flex flex-col items-center text-center gap-4">
      <div className="rounded-xl border border-slate-100 p-3 bg-white">
        <Image src={qr.imageUrl} alt={qr.targetTitle} width={160} height={160} unoptimized />
      </div>
      <div>
        <StatusBadge label={typeLabel[qr.targetType]} tone="brand" dot={false} />
        <p className="mt-2 font-heading font-bold text-sm text-navy">{qr.targetTitle}</p>
        <p className="mt-1 text-xs text-ink font-mono inline-flex items-center gap-1">
          <ScanLine className="w-3.5 h-3.5" />
          {formatNumber(qr.scans)} مسح
        </p>
      </div>
      <div className="flex w-full gap-2">
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-bold text-navy hover:bg-slate-50">
          <Download className="w-3.5 h-3.5" />
          تحميل
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-bold text-navy hover:bg-slate-50">
          <LinkIcon className="w-3.5 h-3.5" />
          نسخ الرابط
        </button>
      </div>
    </div>
  );
}
