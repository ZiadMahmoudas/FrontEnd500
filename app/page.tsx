import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBookOpen,
  faCheck,
  faChevronDown,
  faCirclePlay,
  faClock,
  faCode,
  faFilePdf,
  faGraduationCap,
  faHeadset,
  faLaptopCode,
  faLock,
  faMedal,
  faShieldHalved,
  faStar,
  faUsers,
  faWallet,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import BrandIcon from "@/components/ui/BrandIcon";
import { courses, platformStats, testimonials, faqs } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const heroStudents = [
  "photo-1500648767791-00dcc994a43e",
  "photo-1544005313-94ddf0286df2",
  "photo-1519085360753-af0119f7cbe7",
  "photo-1492562080023-ab3db95bfbce",
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: siteConfig.fullName,
            alternateName: ["المهاجر", "الثواني الأخيرة"],
            url: siteConfig.siteUrl,
            logo: absoluteUrl(siteConfig.logo),
            image: absoluteUrl(siteConfig.cover),
            description: siteConfig.description,
            telephone: `+${siteConfig.phoneInternational}`,
            founder: { "@type": "Person", name: siteConfig.teacherName },
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: siteConfig.teacherName,
            jobTitle: "مدرس الحاسب الآلي والبرمجة",
            url: absoluteUrl("/about"),
            image: absoluteUrl(siteConfig.cover),
            worksFor: { "@type": "EducationalOrganization", name: siteConfig.fullName },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.fullName,
            alternateName: "المهاجر",
            url: siteConfig.siteUrl,
            inLanguage: "ar-EG",
          },
        ]}
      />

      <section className="bg-[#020713] px-2 py-3 sm:px-4">
        <div className="container-app overflow-hidden rounded-[22px] border border-blue-400/20 bg-[#020713] shadow-[0_22px_70px_rgba(2,12,32,.28)]">
          <Image src="/brand/cover.png" alt="الأستاذ محمود المهاجر - منصة الثواني الأخيرة لمراجعة الحاسب الآلي" width={1366} height={288} priority className="h-auto w-full" sizes="100vw" />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,.42),transparent_30%),radial-gradient(circle_at_80%_5%,rgba(34,211,238,.18),transparent_27%),linear-gradient(135deg,#07111f_0%,#0b1f38_55%,#07111f_100%)]" />
        <div className="absolute inset-0 -z-10 bg-grid-lines bg-[size:46px_46px] opacity-[.13]" />
        <div className="absolute -right-24 top-28 -z-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />

        <div className="container-app grid min-h-[760px] gap-12 py-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-20">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-200 backdrop-blur">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="h-3.5 w-3.5" /> مع الأستاذ محمود المهاجر • الثواني الأخيرة
            </span>
            <h1 className="mt-7 max-w-3xl font-heading text-4xl font-black leading-[1.28] md:text-6xl lg:text-[64px]">
              حاسب آلي وبرمجة،
              <span className="block bg-gradient-to-l from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">شرح واضح ومراجعة في الوقت الصح.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              منصة المهاجر تجمع شرح منهج الحاسب الآلي والبرمجة، المراجعات النهائية، الفيديوهات والملازم في مكان واحد لطلاب الثانوية العامة.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/courses" className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-brand to-blue-500 px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(37,99,235,.35)] transition hover:-translate-y-1">
                ابدأ أول درس الآن <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
              </Link>
              <Link href="#experience" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[.06] px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/10">
                <FontAwesomeIcon icon={faCirclePlay} className="h-4 w-4 text-cyan-300" /> شاهد كيف تعمل المنصة
              </Link>
            </div>
            <div className="mt-9 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex -space-x-3 space-x-reverse">
                {heroStudents.map((id) => (
                  <Image key={id} src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=120&q=80`} alt="طالب على المنصة" width={44} height={44} className="h-11 w-11 rounded-full border-2 border-[#07111f] object-cover" />
                ))}
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111f] bg-cyan-300 text-[10px] font-black text-navy">+12K</span>
              </div>
              <div>
                <div className="flex gap-1 text-amber-300">{Array.from({ length: 5 }).map((_, i) => <FontAwesomeIcon key={i} icon={faStar} className="h-3 w-3" />)}</div>
                <p className="mt-1 text-xs text-slate-400">طلاب الثانوية يبدأون رحلتهم مع المهاجر</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[610px] lg:mx-0">
            <div className="absolute -inset-5 rounded-[48px] bg-gradient-to-l from-brand/30 to-cyan-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/15 bg-white/[.06] p-3 shadow-[0_36px_100px_rgba(0,0,0,.38)] backdrop-blur">
              <div className="relative aspect-[4/4.35] overflow-hidden rounded-[28px]">
                <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=88" alt="طالب يتعلم البرمجة باستخدام اللابتوب" fill priority sizes="(max-width: 1024px) 100vw, 610px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-[#07111f]/85 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white"><FontAwesomeIcon icon={faCode} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-white">الدرس الحالي</p>
                      <p className="truncate text-[11px] text-slate-400">الجمل الشرطية واتخاذ القرارات</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-300">18:42</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-gradient-to-l from-cyan-300 to-brand" /></div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-10 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white p-3 text-navy shadow-2xl sm:flex">
              <BrandIcon icon={faShieldHalved} tone="success" className="h-10 w-10 rounded-xl" />
              <div><p className="text-xs font-black">محتوى محمي</p><p className="text-[10px] text-slate-400">لكل طالب بصمته</p></div>
            </div>
            <div className="absolute -left-5 bottom-24 hidden rounded-2xl border border-white/15 bg-[#0b1f38]/90 p-4 shadow-2xl backdrop-blur sm:block">
              <p className="text-[10px] text-slate-400">نسبة إكمال الكورس</p>
              <p className="mt-1 font-heading text-2xl font-black text-white">86%</p>
              <p className="mt-1 text-[10px] font-bold text-emerald-300">↑ تقدم ممتاز</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8">
        <div className="container-app grid grid-cols-2 gap-3 rounded-[28px] border border-slate-100 bg-white p-4 shadow-[0_25px_70px_rgba(15,23,42,.12)] md:grid-cols-4 md:p-6">
          {([
            [faUsers, platformStats.studentsCount, "طالب وطالبة"],
            [faCirclePlay, platformStats.lessonsCount, "درس منظم"],
            [faFilePdf, platformStats.pdfCount, "ملزمة ومراجعة"],
            [faStar, `${platformStats.satisfactionRate}%`, "رضا الطلاب"],
          ] as const).map(([icon, value, label], index) => (
            <div key={label as string} className={`flex items-center gap-3 p-2 md:px-5 ${index !== 3 ? "md:border-l md:border-slate-100" : ""}`}>
              <BrandIcon icon={icon as any} tone={index === 3 ? "warning" : "brand"} className="h-10 w-10 rounded-xl" />
              <div><p className="font-heading text-xl font-black text-navy md:text-2xl">{typeof value === "number" ? formatNumber(value) : value}</p><p className="text-[11px] text-slate-400">{label as string}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-app">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-black text-brand">ابدأ من مستواك الحالي</span>
              <h2 className="mt-2 font-heading text-3xl font-black text-navy md:text-4xl">كورسات مصممة عشان توصلك للنتيجة</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">كل كورس متقسم لوحدات صغيرة، مع تطبيق عملي ومتابعة للتقدم عشان ما تحسش إنك تايه.</p>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-black text-brand">عرض جميع الكورسات <FontAwesomeIcon icon={faArrowLeft} /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} />)}</div>
        </div>
      </section>

      <section id="experience" className="bg-[#f4f7fb] py-24">
        <div className="container-app grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[34px] shadow-[0_30px_80px_rgba(15,23,42,.15)]">
              <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=86" alt="طلاب يتعلمون معًا" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-4 max-w-xs rounded-[24px] border border-white bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,.14)] md:-left-8">
              <div className="flex items-center gap-3"><BrandIcon icon={faMedal} tone="warning" /><div><p className="font-heading text-base font-black text-navy">تعلم بهدف واضح</p><p className="text-xs text-slate-400">فهم + تطبيق + مراجعة</p></div></div>
            </div>
          </div>
          <div>
            <span className="text-xs font-black text-brand">تجربة تعليم مختلفة</span>
            <h2 className="mt-3 font-heading text-3xl font-black leading-[1.45] text-navy md:text-4xl">مش مجرد فيديوهات متخزنة… دي رحلة تعلم كاملة.</h2>
            <p className="mt-5 text-sm leading-8 text-slate-500">الطالب يعرف هو وصل لفين، إيه اللي محتاج يراجعه، وإيه الدرس الجاي. والمدرس يقدر يتابع التقدم ويضيف المحتوى ويفعّل الاشتراكات بسهولة.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {([
                [faLaptopCode, "شرح عملي على الكود", "تشوف الفكرة وتطبّقها فورًا."],
                [faBookOpen, "منهج مرتب بالوحدات", "كل درس في مكانه بدون تشتيت."],
                [faLock, "حماية الفيديو والملازم", "وصول مخصص للطلاب المشتركين."],
                [faHeadset, "دعم سريع على واتساب", "مساعدة وقت ما تحتاجها."],
              ] as const).map(([icon, title, desc], i) => (
                <div key={title as string} className="rounded-2xl border border-slate-200/70 bg-white p-4">
                  <BrandIcon icon={icon as any} tone={i === 2 ? "warning" : i === 3 ? "success" : "brand"} className="h-10 w-10 rounded-xl" />
                  <h3 className="mt-4 text-sm font-black text-navy">{title as string}</h3>
                  <p className="mt-1 text-xs leading-6 text-slate-400">{desc as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-app">
          <div className="text-center"><span className="text-xs font-black text-brand">من التسجيل لأول فيديو</span><h2 className="mt-3 font-heading text-3xl font-black text-navy md:text-4xl">أربع خطوات وتبدأ</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {([
              [faGraduationCap, "اعمل حساب", "سجّل برقم الهاتف وحدد صفك الدراسي."],
              [faBookOpen, "اختار الكورس", "شوف التفاصيل والدروس المتاحة."],
              [faWallet, "فعّل اشتراكك", "فودافون كاش، PayPal أو واتساب."],
              [faCirclePlay, "ابدأ المشاهدة", "شاهد وراجع وتابع نسبة تقدمك."],
            ] as const).map(([icon, title, desc], i) => (
              <article key={title as string} className="relative rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,.06)]">
                <span className="absolute left-5 top-5 font-mono text-3xl font-black text-slate-100">0{i + 1}</span>
                <BrandIcon icon={icon as any} tone={i === 2 ? "warning" : i === 3 ? "success" : "brand"} />
                <h3 className="mt-5 font-heading text-lg font-black text-navy">{title as string}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{desc as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#07111f] py-24 text-white">
        <div className="container-app">
          <div className="text-center"><span className="text-xs font-black text-cyan-300">تجارب حقيقية</span><h2 className="mt-3 font-heading text-3xl font-black md:text-4xl">طلاب فهموا البرمجة بدل ما يحفظوها</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.id} className="rounded-[26px] border border-white/10 bg-white/[.05] p-6 backdrop-blur">
                <div className="flex gap-1 text-amber-300">{Array.from({ length: item.rating }).map((_, i) => <FontAwesomeIcon key={i} icon={faStar} className="h-3.5 w-3.5" />)}</div>
                <p className="mt-5 text-sm leading-8 text-slate-300">“{item.content}”</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5"><Image src={item.avatar} alt={item.name} width={46} height={46} className="h-12 w-12 rounded-2xl object-cover" /><div><p className="text-sm font-black">{item.name}</p><p className="text-[11px] text-slate-500">{item.grade}</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div><span className="text-xs font-black text-brand">الأسئلة الشائعة</span><h2 className="mt-3 font-heading text-3xl font-black leading-[1.45] text-navy">كل اللي محتاج تعرفه قبل ما تبدأ</h2><p className="mt-4 text-sm leading-7 text-slate-500">لسه عندك سؤال؟ فريق الدعم موجود على واتساب لمساعدتك.</p><div className="mt-6"><WhatsAppButton /></div></div>
          <div className="space-y-3">{faqs.map((faq) => <details key={faq.id} className="group rounded-2xl border border-slate-200 bg-white p-1 open:border-brand/20 open:shadow-[0_12px_35px_rgba(37,99,235,.08)]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-black text-navy">{faq.question}<FontAwesomeIcon icon={faChevronDown} className="h-3.5 w-3.5 text-brand transition group-open:rotate-180" /></summary><p className="px-4 pb-4 text-sm leading-7 text-slate-500">{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container-app relative overflow-hidden rounded-[34px] bg-gradient-to-l from-brand to-blue-700 px-6 py-12 text-center text-white shadow-[0_28px_70px_rgba(37,99,235,.26)] md:px-12">
          <div className="absolute inset-0 bg-grid-lines bg-[size:36px_36px] opacity-10" />
          <div className="relative"><h2 className="font-heading text-3xl font-black md:text-4xl">ابدأ دلوقتي وخلي أول سطر كود يغيّر نظرتك للمادة</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100">سجّل مجانًا وشاهد الدروس المفتوحة، وبعدها اختار الكورس المناسب ليك.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/register" className="rounded-2xl bg-white px-7 py-4 text-sm font-black text-brand">إنشاء حساب مجاني</Link><Link href={`https://wa.me/${siteConfig.phoneInternational}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-black"><FontAwesomeIcon icon={faWhatsapp} /> اسألنا على واتساب</Link></div></div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
