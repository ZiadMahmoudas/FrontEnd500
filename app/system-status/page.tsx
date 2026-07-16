"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { API_URL } from "@/lib/api/client";

export default function SystemStatusPage() {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/health`, { cache: "no-store" })
      .then(async (response) => {
        const text = await response.text();
        if (!response.ok) throw new Error(`${response.status}: ${text.slice(0, 180)}`);
        setMessage(text);
        setState("ok");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Network error");
        setState("error");
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] p-5 text-right">
      <div className="w-full max-w-2xl rounded-[30px] bg-white p-7 shadow-2xl">
        <h1 className="font-heading text-3xl font-black text-navy">فحص اتصال منصة المهاجر</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">الفرونت يحاول الاتصال بالعنوان التالي:</p>
        <code dir="ltr" className="mt-3 block overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-cyan-300">{API_URL}/health</code>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 p-5">
          {state === "loading" && <LoaderCircle className="mt-0.5 h-6 w-6 animate-spin text-brand" />}
          {state === "ok" && <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-500" />}
          {state === "error" && <XCircle className="mt-0.5 h-6 w-6 text-rose-500" />}
          <div><p className="font-black text-navy">{state === "loading" ? "جاري الفحص..." : state === "ok" ? "الاتصال ناجح" : "الاتصال فشل"}</p><pre className="mt-2 whitespace-pre-wrap break-all text-xs leading-6 text-slate-500">{message}</pre></div>
        </div>
        {state === "error" && <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs leading-7 text-amber-800">لو Swagger يفتح لكن الفحص يفشل، أضف رابط الـNext.js داخل <b>App:AllowedOrigins</b> و<b>App:FrontEndUrl</b> في استضافة ASP.NET Core، وتأكد أن رابط الـAPI يستخدم HTTPS.</div>}
        <div className="mt-6 flex gap-3"><button onClick={() => location.reload()} className="rounded-xl bg-brand px-5 py-3 text-sm font-black text-white">إعادة الفحص</button><Link href="/login" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-navy">العودة للدخول</Link></div>
      </div>
    </main>
  );
}
