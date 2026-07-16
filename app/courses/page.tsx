"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, LoaderCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { getCourses } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Course, Grade } from "@/lib/types";

const grades: Grade[] = ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState<Grade | "الكل">("الكل");
  const [priceFilter, setPriceFilter] = useState<"الكل" | "مجاني" | "مدفوع">("الكل");
  const [sort, setSort] = useState<"جديد" | "الأكثر مشاهدة">("جديد");

  useEffect(() => {
    getCourses().then(setCourses).catch((reason) => setError(reason instanceof ApiError ? reason.message : "تعذر تحميل الكورسات.")).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = courses.filter((c) => c.title.includes(query) || c.tags.some((t) => t.includes(query)));
    if (grade !== "الكل") result = result.filter((c) => c.grade === grade);
    if (priceFilter === "مجاني") result = result.filter((c) => c.price === 0 && c.status !== "coming_soon");
    if (priceFilter === "مدفوع") result = result.filter((c) => c.price > 0);
    if (sort === "جديد") result = [...result].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    else result = [...result].sort((a, b) => b.viewsCount - a.viewsCount);
    return result;
  }, [courses, grade, priceFilter, query, sort]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="bg-mesh-navy py-14"><div className="container-app text-center"><h1 className="font-heading text-3xl font-extrabold text-white md:text-4xl">الكورسات</h1><p className="mt-3 text-slate-300">ابدأ بالكورس المجاني، أو اشترك في كورس بايثون. باقي الكورسات تظهر بحالة قريبًا.</p></div></section>
      <section className="bg-bg py-10"><div className="container-app">
        <div className="card-surface mb-8 flex flex-col gap-4 p-5">
          <div className="relative"><Search className="pointer-events-none absolute inset-y-0 end-4 my-auto h-5 w-5 text-ink" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن كورس..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pe-12 ps-4 text-sm outline-none transition focus:border-brand" /></div>
          <div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink"><SlidersHorizontal className="h-3.5 w-3.5" />الفلاتر:</span>
            <select value={grade} onChange={(e) => setGrade(e.target.value as Grade | "الكل")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-navy outline-none focus:border-brand"><option value="الكل">الصف الدراسي: الكل</option>{grades.map((g) => <option key={g} value={g}>{g}</option>)}</select>
            <div className="flex rounded-lg border border-slate-200 p-1">{(["الكل", "مجاني", "مدفوع"] as const).map((p) => <button key={p} onClick={() => setPriceFilter(p)} className={cn("rounded-md px-3 py-1.5 text-xs font-bold transition", priceFilter === p ? "bg-navy text-white" : "text-ink hover:bg-slate-50")}>{p}</button>)}</div>
            <div className="flex rounded-lg border border-slate-200 p-1">{(["جديد", "الأكثر مشاهدة"] as const).map((s) => <button key={s} onClick={() => setSort(s)} className={cn("rounded-md px-3 py-1.5 text-xs font-bold transition", sort === s ? "bg-brand text-white" : "text-ink hover:bg-slate-50")}>{s}</button>)}</div>
          </div>
        </div>
        {loading ? <div className="flex items-center justify-center gap-3 py-24 text-sm font-bold text-slate-500"><LoaderCircle className="animate-spin text-brand" /> جاري تحميل الكورسات...</div> : error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center text-sm font-bold text-rose-600">{error}</div> : filtered.length > 0 ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((c) => <CourseCard key={c.id} course={c} />)}</div> : <div className="card-surface flex flex-col items-center gap-3 py-20 text-center"><p className="font-heading font-bold text-navy">لا توجد نتائج مطابقة</p><p className="text-sm text-ink">جرّب تغيير كلمة البحث أو الفلاتر المستخدمة</p></div>}
      </div></section>
      <Footer />
    </div>
  );
}
