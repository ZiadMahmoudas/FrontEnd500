import Link from "next/link";
import { Code2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-mesh-navy p-6 text-center">
      <div className="absolute inset-0 bg-grid-lines bg-[size:40px_40px] opacity-[0.12]" />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-brand-light">
          <Code2 className="h-8 w-8" />
        </span>
        <div className="code-window px-6 py-4 font-mono text-sm text-slate-300" dir="ltr">
          <p className="text-red-400">Error 404: PageNotFound</p>
          <p className="text-slate-500">&gt;&gt;&gt; الصفحة اللي بتدور عليها مش موجودة</p>
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-white">الصفحة غير موجودة</h1>
        <Link
          href="/"
          className="rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-glow hover:brightness-110"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
