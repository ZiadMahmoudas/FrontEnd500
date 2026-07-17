import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export const revalidate = 3600;

type PublicCourse = {
  slug?: string;
  status?: string;
  updatedAt?: string;
  updated_at?: string;
};

function safeDate(value?: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function getPublicCourses(): Promise<PublicCourse[]> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "https://lmslearning.runasp.net/api").replace(/\/$/, "");
  try {
    const response = await fetch(`${apiUrl}/courses`, {
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/courses"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/refund-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const seen = new Set<string>();
  const coursePages: MetadataRoute.Sitemap = (await getPublicCourses())
    .filter((course) => Boolean(course.slug) && ["published", "coming_soon"].includes(course.status || ""))
    .filter((course) => {
      const slug = course.slug!;
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .map((course) => ({
      url: absoluteUrl(`/courses/${course.slug}`),
      lastModified: safeDate(course.updatedAt || course.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...coursePages];
}
