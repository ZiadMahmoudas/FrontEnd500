"use client";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function FloatingLanguageSwitcher() {
  const pathname = usePathname();
  const normalized = pathname || "/";
  const hidden = ["/", "/courses", "/about", "/contact", "/privacy", "/terms", "/refund-policy", "/admin"].some(path => path === "/" ? normalized === "/" : normalized.startsWith(path));
  if (hidden) return null;
  return <div className="fixed left-4 top-4 z-[90] sm:left-6 sm:top-6"><LanguageSwitcher compact /></div>;
}
