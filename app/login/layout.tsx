import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  robots: { index: false, follow: false, noarchive: true },
};

export default function PrivateRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
