"use client";
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";

declare global { interface Window { dataLayer?: Record<string, unknown>[]; gtag?: (...args: unknown[]) => void; } }

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-F4L7E4DV5G";
  const enabled = process.env.NEXT_PUBLIC_GA_DIRECT_ENABLED !== "false";
  useEffect(() => {
    if (!measurementId || !enabled || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", { page_title: document.title, page_location: window.location.href, page_path: `${window.location.pathname}${window.location.search}`, language: locale });
  }, [pathname, locale, measurementId, enabled]);
  if (!measurementId || !enabled) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`}</Script>
  </>;
}
