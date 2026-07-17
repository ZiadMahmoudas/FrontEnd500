"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faDownload,
  faFileExcel,
  faFilter,
  faMagnifyingGlass,
  faMoneyBillTransfer,
  faReceipt,
  faRotate,
  faTrashCan,
  faWallet,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "@/components/StatusBadge";
import BrandIcon from "@/components/ui/BrandIcon";
import {
  deleteAdminPayment,
  downloadPaymentProof,
  exportPayments,
  getAdminPayments,
  reviewPayment,
  type AdminPayment,
  type PaymentFilters,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { PaymentMethod, PaymentStatus } from "@/lib/types";

const methodLabels: Record<PaymentMethod, string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "InstaPay",
  paypal: "PayPal",
  whatsapp: "واتساب",
  manual: "يدوي",
  free: "مجاني",
};

const statusLabels: Record<PaymentStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
  failed: "فشل",
  cancelled: "ملغي",
  refunded: "مسترد",
};

function statusTone(status: PaymentStatus): "success" | "warning" | "danger" | "neutral" {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  if (status === "failed" || status === "rejected" || status === "refunded") return "danger";
  return "neutral";
}

function dateTime(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [summary, setSummary] = useState({ count: 0, approved_count: 0, pending_count: 0, approved_egp: 0 });
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [searchDraft, setSearchDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminPayments(filters);
      setPayments(response.payments);
      setSummary(response.summary);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحميل سجل المدفوعات.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const pending = useMemo(() => payments.filter((payment) => payment.status === "pending"), [payments]);

  async function decide(payment: AdminPayment, status: "approved" | "rejected") {
    if (payment.method === "paypal") {
      setError("مدفوعات PayPal يتم اعتمادها تلقائيًا بعد التحقق من PayPal، ولا تُعتمد يدويًا.");
      return;
    }
    const notes = status === "rejected" ? window.prompt("اكتب سبب الرفض الذي سيظهر في السجل:", "تعذر التحقق من التحويل") ?? "" : "تم التحقق من التحويل";
    if (status === "rejected" && !notes.trim()) return;
    setActionId(payment.id);
    setError("");
    try {
      const response = await reviewPayment(payment.id, status, notes);
      setMessage(response.message);
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تحديث حالة الدفع.");
    } finally {
      setActionId(null);
    }
  }


  async function removePayment(payment: AdminPayment) {
    const typed = window.prompt(`سيتم حذف عملية ${payment.order_code} والإيصال والاشتراك المرتبط بها.\nاكتب كود الطلب للتأكيد:`);
    if (typed !== payment.order_code) return;
    setActionId(payment.id);
    setError("");
    try {
      const response = await deleteAdminPayment(payment.id);
      setMessage(response.message);
      await load();
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر حذف عملية الدفع.");
    } finally {
      setActionId(null);
    }
  }

  async function exportFile() {
    setExporting(true);
    setError("");
    try {
      await exportPayments(filters);
      setMessage("تم تجهيز ملف Excel وتنزيله بنجاح.");
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "تعذر تصدير ملف Excel.");
    } finally {
      setExporting(false);
    }
  }

  function applySearch() {
    setFilters((current) => ({ ...current, search: searchDraft.trim() || undefined }));
  }

  const cards = [
    { label: "كل العمليات", value: summary.count, icon: faMoneyBillTransfer, tone: "brand" as const },
    { label: "قيد المراجعة", value: summary.pending_count, icon: faClock, tone: "warning" as const },
    { label: "عمليات مقبولة", value: summary.approved_count, icon: faCheck, tone: "success" as const },
    { label: "إجمالي المحصل", value: formatPrice(Number(summary.approved_egp)), icon: faWallet, tone: "navy" as const },
  ];

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-black text-brand">المحاسبة والتحصيل</p>
          <h1 className="font-heading text-2xl font-black text-navy md:text-3xl">سجل المدفوعات الحقيقي</h1>
          <p className="mt-2 text-sm text-slate-500">راجع التحويلات اليدوية، تابع PayPal، ونزّل تقرير Excel بكل بيانات الطلاب والطلبات.</p>
        </div>
        <button onClick={exportFile} disabled={exporting} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-black text-white shadow-[0_14px_30px_rgba(5,150,105,.2)] transition hover:-translate-y-0.5 disabled:opacity-60">
          <FontAwesomeIcon icon={faFileExcel} /> {exporting ? "جاري تجهيز الملف..." : "تصدير Excel"}
        </button>
      </section>

      {(error || message) && <div className={`rounded-2xl border p-4 text-sm font-bold ${error ? "border-rose-200 bg-rose-50 text-rose-600" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-[24px] border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.06)]">
            <div className="flex items-center justify-between"><BrandIcon icon={card.icon} tone={card.tone} /><span className="text-[10px] font-black text-slate-400">حسب الفلاتر</span></div>
            <p className="mt-4 text-xs font-bold text-slate-500">{card.label}</p>
            <strong className="mt-1 block font-heading text-2xl font-black text-navy">{typeof card.value === "number" ? formatNumber(card.value) : card.value}</strong>
          </article>
        ))}
      </section>

      <section className="rounded-[26px] border border-white bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,.05)] md:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black text-navy"><FontAwesomeIcon icon={faFilter} className="text-brand" /> فلترة التقرير والسجل</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <div className="relative xl:col-span-2"><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") applySearch(); }} placeholder="اسم الطالب، الهاتف، كود الطلب أو العملية" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-xs outline-none focus:border-brand/40" /></div>
          <select value={filters.status ?? ""} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value || undefined }))} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-navy outline-none"><option value="">كل الحالات</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <select value={filters.method ?? ""} onChange={(event) => setFilters((current) => ({ ...current, method: event.target.value || undefined }))} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-navy outline-none"><option value="">كل الطرق</option>{Object.entries(methodLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <input aria-label="من تاريخ" type="date" value={filters.date_from ?? ""} onChange={(event) => setFilters((current) => ({ ...current, date_from: event.target.value || undefined }))} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none" />
          <input aria-label="إلى تاريخ" type="date" value={filters.date_to ?? ""} onChange={(event) => setFilters((current) => ({ ...current, date_to: event.target.value || undefined }))} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none" />
          <div className="flex gap-2"><button onClick={applySearch} className="flex-1 rounded-xl bg-navy px-3 text-xs font-black text-white">بحث</button><button onClick={() => { setSearchDraft(""); setFilters({}); }} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500" aria-label="إلغاء الفلاتر"><FontAwesomeIcon icon={faRotate} /></button></div>
        </div>
      </section>

      {pending.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between"><div><h2 className="font-heading text-lg font-black text-navy">طلبات تحتاج مراجعتك</h2><p className="mt-1 text-xs text-slate-400">اعتمد فقط بعد مطابقة الرقم والمبلغ والإيصال داخل تطبيق المحفظة أو البنك.</p></div><StatusBadge label={`${pending.length} طلب`} tone="warning" /></div>
          <div className="grid gap-4 xl:grid-cols-2">
            {pending.map((payment) => (
              <article key={payment.id} className="rounded-[24px] border border-amber-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)]">
                <div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-heading font-black text-navy">{payment.student_name}</h3><StatusBadge label={methodLabels[payment.method]} tone="brand" dot={false} /></div><p className="mt-1 font-mono text-xs text-slate-400">{payment.student_phone} • {payment.order_code}</p></div><strong className="font-heading text-lg font-black text-navy">{formatPrice(Number(payment.course_price_egp))}</strong></div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600"><p className="font-black text-navy">{payment.course_title}</p><div className="mt-2 grid gap-x-5 sm:grid-cols-2"><p>رقم العملية: <b className="font-mono text-navy">{payment.transaction_id || "—"}</b></p><p>اسم المحول: <b className="text-navy">{payment.payer_name || "—"}</b></p><p>هاتف المحول: <b className="font-mono text-navy">{payment.payer_phone || "—"}</b></p><p>وقت التحويل: <b className="text-navy">{dateTime(payment.transferred_at)}</b></p><p>التحويل إلى: <b className="font-mono text-navy">{payment.transfer_to || "—"}</b></p><p>اسم الحساب: <b className="text-navy">{payment.account_name || "—"}</b></p></div></div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {payment.proof_path && <button onClick={() => downloadPaymentProof(payment.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-navy"><FontAwesomeIcon icon={faReceipt} /> تنزيل الإيصال</button>}
                  <button onClick={() => decide(payment, "approved")} disabled={actionId === payment.id} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white disabled:opacity-60"><FontAwesomeIcon icon={faCheck} /> اعتماد وتفعيل الكورس</button>
                  <button onClick={() => decide(payment, "rejected")} disabled={actionId === payment.id} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-black text-rose-600 disabled:opacity-60"><FontAwesomeIcon icon={faXmark} /> رفض</button>
                  <button title="حذف نهائي" onClick={() => removePayment(payment)} disabled={actionId === payment.id} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-black text-rose-700 disabled:opacity-60"><FontAwesomeIcon icon={faTrashCan} /> حذف</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-[26px] border border-white bg-white shadow-[0_10px_35px_rgba(15,23,42,.05)]">
        <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-heading text-lg font-black text-navy">كل عمليات الدفع</h2><p className="mt-1 text-xs text-slate-400">كل صف هنا قابل للتصدير بنفس الفلاتر الحالية.</p></div><FontAwesomeIcon icon={faDownload} className="text-brand" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead><tr className="bg-slate-50/80">{["كود الطلب", "الطالب", "الكورس", "الطريقة", "سعر الكورس", "المبلغ/العملة", "رقم العملية", "الحالة", "التاريخ", "إجراء"].map((title) => <th key={title} className="px-4 py-3 text-start text-[11px] font-black text-slate-500">{title}</th>)}</tr></thead>
            <tbody>{loading ? <tr><td colSpan={10} className="p-10 text-center text-sm font-bold text-slate-400">جاري تحميل المدفوعات...</td></tr> : payments.length === 0 ? <tr><td colSpan={10} className="p-10 text-center text-sm font-bold text-slate-400">لا توجد عمليات مطابقة للفلاتر.</td></tr> : payments.map((payment) => (
              <tr key={payment.id} className="border-t border-slate-100 text-xs hover:bg-slate-50/70">
                <td className="px-4 py-4 font-mono font-bold text-brand">{payment.order_code}</td>
                <td className="px-4 py-4"><b className="block text-navy">{payment.student_name}</b><span className="mt-1 block font-mono text-[10px] text-slate-400">{payment.student_phone}</span></td>
                <td className="max-w-[220px] px-4 py-4 font-bold text-slate-600">{payment.course_title}</td>
                <td className="px-4 py-4 font-bold text-navy">{methodLabels[payment.method]}</td>
                <td className="px-4 py-4 font-black text-navy">{formatPrice(Number(payment.course_price_egp))}</td>
                <td className="px-4 py-4 font-mono text-slate-600">{Number(payment.amount).toLocaleString("ar-EG")} {payment.currency}</td>
                <td className="px-4 py-4 font-mono text-slate-500">{payment.transaction_id || payment.provider_capture_id || "—"}</td>
                <td className="px-4 py-4"><StatusBadge label={statusLabels[payment.status]} tone={statusTone(payment.status)} /></td>
                <td className="px-4 py-4 whitespace-nowrap text-slate-500">{dateTime(payment.created_at)}</td>
                <td className="px-4 py-4"><div className="flex items-center gap-2">{payment.proof_path ? <button onClick={() => downloadPaymentProof(payment.id)} className="rounded-lg border border-slate-200 px-3 py-2 font-black text-navy">الإيصال</button> : null}<button title="حذف نهائي" onClick={() => removePayment(payment)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600"><FontAwesomeIcon icon={faTrashCan} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
