import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleTagManagerEvents from "@/components/analytics/GoogleTagManagerEvents";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import FloatingLanguageSwitcher from "@/components/i18n/FloatingLanguageSwitcher";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { getPreferredLocale } from "@/lib/i18n/server";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06162f", colorScheme: "light" };

export async function generateMetadata(): Promise<Metadata> {
  const title = `${siteConfig.fullName} | الحاسب الآلي والبرمجة للثانوية العامة`;
  const description = siteConfig.description;
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    applicationName: siteConfig.fullName,
    title: { default: title, template: `%s | ${siteConfig.name}` },
    description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.teacherName, url: absoluteUrl("/about") }],
    creator: siteConfig.teacherName,
    publisher: siteConfig.fullName,
    category: "education",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: "/",
      siteName: siteConfig.fullName,
      title,
      description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.teacherName} - ${siteConfig.fullName}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [siteConfig.ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getPreferredLocale();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-P3L52THD";
  return (
    <html lang={locale} dir={locale === "en" ? "ltr" : "rtl"} className={locale === "en" ? "i18n-booting" : undefined} suppressHydrationWarning>
      <head>
        {gtmId ? <script id="google-tag-manager" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');` }} /> : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="font-body bg-bg text-navy antialiased">
        {gtmId ? <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" /></noscript> : null}
        <LanguageProvider initialLocale={locale}>
          <AuthProvider>{children}</AuthProvider>
          <FloatingLanguageSwitcher />
          <GoogleTagManagerEvents />
          <GoogleAnalytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
