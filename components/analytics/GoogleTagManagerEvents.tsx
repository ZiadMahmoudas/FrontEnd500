"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";

declare global { interface Window { dataLayer?: Record<string, unknown>[]; gtag?: (...args: unknown[]) => void; } }

export default function GoogleTagManagerEvents() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "virtual_page_view", page_path: `${window.location.pathname}${window.location.search}`, page_location: window.location.href, page_title: document.title, page_language: locale });
  }, [pathname, locale]);
  return null;
}
