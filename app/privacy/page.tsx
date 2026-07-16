import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "سياسة الخصوصية", description: "سياسة الخصوصية لمنصة المهاجر التعليمية.", alternates: { canonical: "/privacy" } };
export default function PrivacyPage() { return <Policy title="سياسة الخصوصية" sections={["نحفظ بيانات الحساب اللازمة لتقديم الخدمة مثل الاسم والهاتف والصف الدراسي، ولا نبيع بيانات الطلاب لأي جهة إعلانية.","تستخدم بيانات الدفع للتحقق من الاشتراك وتوثيق العملية، وتظهر فقط للمستخدمين المصرح لهم داخل الإدارة.","يمكن للمستخدم طلب تصحيح بياناته أو حذف حسابه بالتواصل مع إدارة المنصة.","قد نستخدم أدوات قياس الزيارات مثل Google Analytics بعد تفعيلها بهدف تحسين تجربة المنصة."]} />; }
function Policy({ title, sections }: { title: string; sections: string[] }) { return <div className="min-h-screen bg-bg"><Navbar /><main className="container-app max-w-4xl py-16"><h1 className="font-heading text-4xl font-black text-navy">{title}</h1><div className="mt-8 space-y-4 rounded-[28px] bg-white p-7 shadow-sm">{sections.map((item) => <p key={item} className="leading-8 text-slate-600">{item}</p>)}</div></main><Footer /></div>; }
