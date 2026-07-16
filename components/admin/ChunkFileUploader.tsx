"use client";

import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCloudArrowUp, faFile, faRotate, faSpinner, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ApiError } from "@/lib/api/client";
import { uploadFileInChunks, type CompletedUpload, type UploadKind } from "@/lib/api/uploads";

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(bytes >= 10 * 1024 ** 2 ? 0 : 1)} MB`;
}

interface Props {
  kind: UploadKind;
  accept: string;
  label: string;
  hint: string;
  existingLabel?: string;
  value?: CompletedUpload | null;
  onComplete: (upload: CompletedUpload) => void;
  onClear?: () => void;
}

export default function ChunkFileUploader({ kind, accept, label, hint, existingLabel, value, onComplete, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function selectFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setError("");
    setProgress(0);
    setUploading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const completed = await uploadFileInChunks(file, kind, (percent) => setProgress(percent), controller.signal);
      onComplete(completed);
      setProgress(100);
    } catch (reason) {
      if (controller.signal.aborted) setError("تم إلغاء الرفع.");
      else setError(reason instanceof ApiError ? reason.message : "تعذر رفع الملف. تحقق من الاتصال والمساحة المتاحة.");
    } finally {
      setUploading(false);
      abortRef.current = null;
    }
  }

  function cancel() {
    abortRef.current?.abort();
  }

  function reset() {
    setError("");
    setProgress(0);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  }

  const done = Boolean(value);

  return (
    <div className={`rounded-3xl border p-4 ${error ? "border-rose-200 bg-rose-50/40" : done ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-slate-50/70"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-navy">{label}</h3>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">{hint}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${done ? "bg-emerald-500 text-white" : "bg-white text-brand shadow-sm"}`}>
          <FontAwesomeIcon icon={done ? faCheck : uploading ? faSpinner : faCloudArrowUp} spin={uploading} />
        </span>
      </div>

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />

      {uploading ? (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-white p-4">
          <div className="flex items-center justify-between gap-3 text-xs font-bold">
            <span className="min-w-0 truncate text-navy">{fileName}</span>
            <span className="font-mono text-brand">{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-l from-brand to-cyan-400 transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400"><span>الملف يُرفع على أجزاء صغيرة لمنع التهنيج.</span><button type="button" onClick={cancel} className="inline-flex items-center gap-1 font-black text-rose-600"><FontAwesomeIcon icon={faXmark} /> إلغاء</button></div>
        </div>
      ) : done ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><FontAwesomeIcon icon={faFile} /></span>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-navy">{value?.name || fileName}</p><p className="mt-1 text-[10px] text-emerald-600">اكتمل الرفع • {formatBytes(value?.size || 0)}</p></div>
          <button type="button" onClick={reset} className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 text-rose-500" title="حذف الاختيار"><FontAwesomeIcon icon={faTrashCan} /></button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-5 text-xs font-black text-brand transition hover:border-brand/40 hover:bg-brand/[.02]">
          <FontAwesomeIcon icon={error ? faRotate : faCloudArrowUp} /> {error ? "جرّب الرفع مرة أخرى" : existingLabel || "اختر ملفًا من الجهاز"}
        </button>
      )}

      {error && <p className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-[11px] font-bold leading-5 text-rose-700">{error}</p>}
    </div>
  );
}
