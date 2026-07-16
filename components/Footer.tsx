import Link from "next/link";
import { Code2, MessageCircle, Facebook, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="container-app py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-brand-light">
              <Code2 className="h-5 w-5" />
            </span>
            <span className="font-heading font-extrabold text-lg text-white">
              كود<span className="text-brand-light">باث</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            منصة تعليمية متخصصة في تدريس البرمجة وعلوم الحاسب لطلاب الثانوية العامة.
          </p>
          <div className="mt-5 flex gap-3">
            {[MessageCircle, Facebook, Youtube, Instagram].map((Icon, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:bg-brand hover:text-white transition-colors cursor-pointer"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white mb-4">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-brand-light transition-colors">الرئيسية</Link></li>
            <li><Link href="/courses" className="hover:text-brand-light transition-colors">الكورسات</Link></li>
            <li><Link href="/dashboard" className="hover:text-brand-light transition-colors">لوحة الطالب</Link></li>
            <li><Link href="/login" className="hover:text-brand-light transition-colors">تسجيل الدخول</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white mb-4">الدعم</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="#faq" className="hover:text-brand-light transition-colors">الأسئلة الشائعة</Link></li>
            <li><Link href="/payment-proof" className="hover:text-brand-light transition-colors">تأكيد عملية دفع</Link></li>
            <li><span className="hover:text-brand-light transition-colors cursor-pointer">سياسة الاسترجاع</span></li>
            <li><span className="hover:text-brand-light transition-colors cursor-pointer">شروط الاستخدام</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-white mb-4">تواصل معنا</h4>
          <ul className="space-y-2.5 text-sm font-mono text-slate-400">
            <li>WhatsApp: 01000000000</li>
            <li>info@codepath.example.com</li>
            <li>القاهرة، مصر</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 كودباث. جميع الحقوق محفوظة.</p>
          <p className="font-mono">Built with Next.js — Frontend Only</p>
        </div>
      </div>
    </footer>
  );
}
