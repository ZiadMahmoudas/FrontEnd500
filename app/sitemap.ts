import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export const revalidate = 3600;

type PublicCourse = {
  slug?: string;
  status?: string;
  updatedAt?: string;
  updated_at?: string;
};

function safeDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function getCourses(): Promise<PublicCourse[]> {
  const api = (process.env.NEXT_PUBLIC_API_URL || "https://lmslearning.runasp.net/api").replace(/\/$/, "");
  try {
    const response = await fetch(`${api}/courses`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.courses) ? payload.courses : [];
  } catch {
    return [];
  }
}

function entry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return { url: absoluteUrl(path), lastModified, changeFrequency, priority };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    entry("/", now, "weekly", 1),
    entry("/courses", now, "daily", 0.9),
    entry("/about", now, "monthly", 0.8),
    entry("/contact", now, "monthly", 0.7),
    entry("/privacy", now, "yearly", 0.3),
    entry("/terms", now, "yearly", 0.3),
    entry("/refund-policy", now, "yearly", 0.3),
  ];

  const seen = new Set<string>();
  const courseEntries = (await getCourses())
    .filter(course => course.slug && ["published", "coming_soon"].includes(course.status || ""))
    .filter(course => !seen.has(course.slug!) && Boolean(seen.add(course.slug!)))
    .map(course => entry(`/courses/${course.slug}`, safeDate(course.updatedAt || course.updated_at), "weekly", 0.8));

  return [...pages, ...courseEntries];
}
