import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerLocale, localizedPath } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: locale === "en" ? "Privacy Policy" : "سياسة الخصوصية", description: locale === "en" ? "Privacy policy for Elmohager educational platform." : "سياسة الخصوصية لمنصة المهاجر التعليمية.", alternates: { canonical: localizedPath(locale, "/privacy") } };
}
export default async function PrivacyPage() {
  const en = (await getServerLocale()) === "en";
  const sections = en ? [
    "We store only the account information required to provide the service, such as name, phone number and school grade. We do not sell student data to advertisers.",
    "Payment information is used to verify subscriptions and document transactions and is visible only to authorized administrators.",
    "Users may request correction of their information or account deletion by contacting the platform administration.",
    "We may use measurement tools such as Google Analytics to improve the platform experience after analytics is enabled.",
  ] : ["نحفظ بيانات الحساب اللازمة لتقديم الخدمة مثل الاسم والهاتف والصف الدراسي، ولا نبيع بيانات الطلاب لأي جهة إعلانية.","تستخدم بيانات الدفع للتحقق من الاشتراك وتوثيق العملية، وتظهر فقط للمستخدمين المصرح لهم داخل الإدارة.","يمكن للمستخدم طلب تصحيح بياناته أو حذف حسابه بالتواصل مع إدارة المنصة.","قد نستخدم أدوات قياس الزيارات مثل Google Analytics بعد تفعيلها بهدف تحسين تجربة المنصة."];
  return <Policy title={en ? "Privacy Policy" : "سياسة الخصوصية"} sections={sections} />;
}
function Policy({ title, sections }: { title: string; sections: string[] }) { return <div className="min-h-screen bg-bg"><Navbar /><main className="container-app max-w-4xl py-16"><h1 className="font-heading text-4xl font-black text-navy">{title}</h1><div className="mt-8 space-y-4 rounded-[28px] bg-white p-7 shadow-sm">{sections.map((item) => <p key={item} className="leading-8 text-slate-600">{item}</p>)}</div></main><Footer /></div>; }
