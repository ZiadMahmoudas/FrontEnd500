"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { locale, toggleLocale } = useLanguage();
  return (
    <button type="button" onClick={toggleLocale} data-no-translate aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border font-black transition active:scale-95 ${compact ? "h-10 px-3 text-xs" : "h-11 px-4 text-xs"} ${dark ? "border-white/15 bg-white/[.06] text-white hover:bg-white/10" : "border-slate-200 bg-white text-navy shadow-sm hover:border-brand/30 hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-white"}`}>
      <FontAwesomeIcon icon={faGlobe} className="h-3.5 w-3.5" /><span>{locale === "ar" ? "EN" : "AR"}</span>
    </button>
  );
}
