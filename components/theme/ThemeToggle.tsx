"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function ThemeToggle({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { isEnglish } = useLanguage();
  const nextLabel = theme === "dark"
    ? (isEnglish ? "Switch to light mode" : "التبديل إلى الوضع الفاتح")
    : (isEnglish ? "Switch to dark mode" : "التبديل إلى الوضع الداكن");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
      data-no-translate
      className={`inline-flex items-center justify-center rounded-2xl border transition active:scale-95 ${compact ? "h-10 w-10" : "h-11 w-11"} ${dark ? "border-white/15 bg-white/[.07] text-white hover:bg-white/12" : "border-slate-200 bg-white text-navy shadow-sm hover:border-brand/30 hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
