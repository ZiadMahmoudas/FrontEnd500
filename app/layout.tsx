import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "كودباث | منصة تعلم البرمجة للثانوية العامة",
  description:
    "منصة تعليمية متخصصة في تدريس البرمجة وعلوم الحاسب لطلاب الثانوية العامة، فيديوهات محمية، ملازم PDF، اشتراكات، ومتابعة تقدم لحظية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="font-body bg-bg text-navy antialiased"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
