import Link from "next/link";
import { MessageCircle, Facebook, Youtube, Instagram, Phone, Mail, MapPin } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const whatsappUrl = `https://wa.me/${siteConfig.phoneInternational}`;

  return (
    <footer className="bg-navy text-slate-300">
      <div className="container-app grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={58} />
            <div>
              <span className="block font-heading text-xl font-black text-white">المهاجر</span>
              <span className="text-[10px] font-bold text-amber-300">الثواني الأخيرة</span>
            </div>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            منصة الأستاذ محمود المهاجر لشرح ومراجعة الحاسب الآلي والبرمجة لطلاب الثانوية العامة.
          </p>
          <div className="mt-5 flex gap-3">
            <a aria-label="واتساب" href={whatsappUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors hover:bg-emerald-500 hover:text-white"><MessageCircle className="h-4 w-4" /></a>
            {[Facebook, Youtube, Instagram].map((Icon, i) => (
              <span key={i} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-500"><Icon className="h-4 w-4" /></span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-heading font-bold text-white">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="transition-colors hover:text-brand-light">الرئيسية</Link></li>
            <li><Link href="/courses" className="transition-colors hover:text-brand-light">الكورسات</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-brand-light">عن الأستاذ محمود المهاجر</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-brand-light">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading font-bold text-white">السياسات والدعم</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/#faq" className="transition-colors hover:text-brand-light">الأسئلة الشائعة</Link></li>
            <li><Link href="/payment-proof" className="transition-colors hover:text-brand-light">تأكيد عملية دفع</Link></li>
            <li><Link href="/refund-policy" className="transition-colors hover:text-brand-light">سياسة الاسترجاع</Link></li>
            <li><Link href="/terms" className="transition-colors hover:text-brand-light">شروط الاستخدام</Link></li>
            <li><Link href="/privacy" className="transition-colors hover:text-brand-light">سياسة الخصوصية</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading font-bold text-white">تواصل معنا</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><a href={`tel:+${siteConfig.phoneInternational}`} className="flex items-center gap-2 transition hover:text-white"><Phone className="h-4 w-4 text-amber-300" /> {siteConfig.phoneDisplay}</a></li>
            <li><a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition hover:text-white"><Mail className="h-4 w-4 text-amber-300" /> {siteConfig.email}</a></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-300" /> {siteConfig.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 منصة المهاجر — الثواني الأخيرة. جميع الحقوق محفوظة.</p>
          <p>الحاسب الآلي والبرمجة للثانوية العامة</p>
        </div>
      </div>
    </footer>
  );
}
