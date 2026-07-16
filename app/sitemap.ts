import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

type PublicCourse = { slug?: string; updatedAt?: string; updated_at?: string };

async function getPublicCourseSlugs(): Promise<PublicCourse[]> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "https://lmslearning.runasp.net/api").replace(/\/$/, "");
  try {
    const response = await fetch(`${apiUrl}/courses`, { next: { revalidate: 3600 } });
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
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/refund-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const courses = await getPublicCourseSlugs();
  const coursePages: MetadataRoute.Sitemap = courses
    .filter((course) => course.slug)
    .map((course) => ({
      url: absoluteUrl(`/courses/${course.slug}`),
      lastModified: course.updatedAt || course.updated_at || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticPages, ...coursePages];
}
