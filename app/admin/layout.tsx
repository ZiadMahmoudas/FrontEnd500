import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faBookOpen, faCirclePlay, faUsers, faWallet, faComments, faQrcode, faGear } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import RoleGuard from "@/components/auth/RoleGuard";

export const metadata: Metadata = {
  title: "لوحة الإدارة",
  robots: { index: false, follow: false, noarchive: true },
};

const mobileNav = [
  ["/admin", "الرئيسية", faChartPie],
  ["/admin/courses", "الكورسات", faBookOpen],
  ["/admin/lessons", "الدروس", faCirclePlay],
  ["/admin/students", "الطلاب", faUsers],
  ["/admin/payments", "الدفع", faWallet],
  ["/admin/reviews", "التقييمات", faComments],
  ["/admin/qrcodes", "QR", faQrcode],
  ["/admin/settings", "الإعدادات", faGear],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={["admin", "instructor"]}>
    <div className="min-h-screen bg-[#f4f7fb] lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminTopbar />
        <div className="sticky top-0 z-40 flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
          {mobileNav.map(([href, label, icon]) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-navy shadow-sm">
              <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-brand" /> {label}
            </Link>
          ))}
        </div>
        <main className="p-4 md:p-7 xl:p-8">{children}</main>
      </div>
    </div>
    </RoleGuard>
  );
}
