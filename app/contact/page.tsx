import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";
import { getServerLocale, localizedPath } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const en = locale === "en";
  const path = localizedPath(locale, "/contact");
  return {
    title: en ? "Contact Elmohager Platform" : "تواصل مع منصة المهاجر",
    description: en ? "Contact Elmohager Platform for course, subscription and payment support." : "تواصل مع منصة المهاجر للاستفسار عن كورسات الحاسب الآلي والبرمجة والاشتراكات للثانوية العامة.",
    alternates: { canonical: path, languages: { "ar-EG": "/contact", "en-US": "/en/contact" } },
  };
}

export default async function ContactPage() {
  const locale = await getServerLocale();
  const en = locale === "en";
  return (
    <div className="min-h-screen bg-bg"><Navbar />
      <section className="bg-mesh-navy py-16 text-center text-white"><div className="container-app"><span className="text-xs font-black text-amber-300">{en ? "We are here to help" : "نحن معك"}</span><h1 className="mt-3 font-heading text-4xl font-black">{en ? "Contact Elmohager Platform" : "تواصل مع منصة المهاجر"}</h1><p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">{en ? "For questions about subscriptions, courses or payment verification, use one of the following methods." : "للاستفسار عن الاشتراكات والكورسات ومتابعة التحويلات، تواصل معنا من خلال الوسائل التالية."}</p></div></section>
      <section className="container-app grid gap-5 py-16 md:grid-cols-3">
        <a href={`https://wa.me/${siteConfig.phoneInternational}`} target="_blank" rel="noreferrer" className="rounded-[28px] border border-emerald-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1"><MessageCircle className="mx-auto h-10 w-10 text-emerald-500" /><h2 className="mt-4 font-heading text-xl font-black text-navy">WhatsApp</h2><p className="mt-2 text-slate-500">{siteConfig.phoneDisplay}</p></a>
        <a href={`tel:+${siteConfig.phoneInternational}`} className="rounded-[28px] border border-blue-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1"><Phone className="mx-auto h-10 w-10 text-brand" /><h2 className="mt-4 font-heading text-xl font-black text-navy">{en ? "Phone call" : "اتصال هاتفي"}</h2><p className="mt-2 text-slate-500">{siteConfig.phoneDisplay}</p></a>
        <a href={`mailto:${siteConfig.email}`} className="rounded-[28px] border border-amber-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1"><Mail className="mx-auto h-10 w-10 text-amber-500" /><h2 className="mt-4 font-heading text-xl font-black text-navy">{en ? "Email" : "البريد الإلكتروني"}</h2><p className="mt-2 break-all text-sm text-slate-500">{siteConfig.email}</p></a>
        <div className="md:col-span-3 flex items-center justify-center gap-2 rounded-2xl bg-white p-5 text-sm font-bold text-slate-500"><MapPin className="h-5 w-5 text-brand" /> {en ? "Online learning for secondary school students across Egypt." : "نخدم طلاب الثانوية العامة في جميع محافظات مصر أونلاين."}</div>
      </section>
      <Footer /></div>
  );
}
