"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthProvider";
import type { UserRole } from "@/lib/types";

export default function RoleGuard({ children, roles }: { children: React.ReactNode; roles: UserRole[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace(user.role === "student" ? "/dashboard" : "/admin");
    }
  }, [loading, pathname, roles, router, user]);

  if (loading || !user || !roles.includes(user.role)) {
    return <div className="flex min-h-[55vh] items-center justify-center"><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-500 shadow-sm"><FontAwesomeIcon icon={faSpinner} spin className="text-brand" /> جاري التحقق من الحساب...</div></div>;
  }
  return <>{children}</>;
}
