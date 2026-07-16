import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function AdminAlert({ message, tone = "success" }: { message: string; tone?: "success" | "danger" }) {
  if (!message) return null;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
      <FontAwesomeIcon icon={tone === "success" ? faCircleCheck : faTriangleExclamation} className="mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
