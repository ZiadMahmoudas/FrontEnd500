import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export const revalidate = 3600;
type PublicCourse = { slug?: string; status?: string; updatedAt?: string; updated_at?: string };
function safeDate(value?: string) { const date = value ? new Date(value) : new Date(); return Number.isNaN(date.getTime()) ? new Date() : date; }
async function getCourses(): Promise<PublicCourse[]> {
  const api = (process.env.NEXT_PUBLIC_API_URL || "https://lmslearning.runasp.net/api").replace(/\/$/, "");
  try {
    const response = await fetch(`${api}/courses`, { headers: { Accept: "application/json" }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.courses) ? payload.courses : [];
  } catch { return []; }
}
function bilingual(path: string, lastModified: Date, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number): MetadataRoute.Sitemap {
  const ar = absoluteUrl(path);
  const en = absoluteUrl(path === "/" ? "/en" : `/en${path}`);
  const alternates = { languages: { "ar-EG": ar, "en-US": en } };
  return [{ url: ar, lastModified, changeFrequency, priority, alternates }, { url: en, lastModified, changeFrequency, priority, alternates }];
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = [
    ...bilingual("/", now, "weekly", 1), ...bilingual("/courses", now, "daily", .9),
    ...bilingual("/about", now, "monthly", .8), ...bilingual("/contact", now, "monthly", .7),
    ...bilingual("/privacy", now, "yearly", .3), ...bilingual("/terms", now, "yearly", .3),
    ...bilingual("/refund-policy", now, "yearly", .3)
  ];
  const seen = new Set<string>();
  const courses = (await getCourses()).filter(c => c.slug && ["published", "coming_soon"].includes(c.status || "")).filter(c => !seen.has(c.slug!) && Boolean(seen.add(c.slug!))).flatMap(c => bilingual(`/courses/${c.slug}`, safeDate(c.updatedAt || c.updated_at), "weekly", .8));
  return [...pages, ...courses];
}
