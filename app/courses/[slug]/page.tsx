import type { Metadata } from "next";
import CourseDetailsClient from "@/components/courses/CourseDetailsClient";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import type { Course } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

async function getCourse(slug: string): Promise<Course | null> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "https://lmslearning.runasp.net/api").replace(/\/$/, "");
  try {
    const response = await fetch(`${apiUrl}/courses/${encodeURIComponent(slug)}`, {
      next: { revalidate: 900 },
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.course || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) {
    return {
      title: "تفاصيل الكورس",
      description: siteConfig.description,
      alternates: { canonical: `/courses/${slug}` },
    };
  }

  const description = course.shortDescription || course.description || siteConfig.description;
  const image = course.image || siteConfig.ogImage;
  return {
    title: course.title,
    description,
    keywords: [...siteConfig.keywords, ...course.tags],
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      type: "website",
      title: `${course.title} | منصة المهاجر`,
      description,
      url: `/courses/${course.slug}`,
      images: [{ url: image, alt: course.title }],
    },
    twitter: { card: "summary_large_image", title: course.title, description, images: [image] },
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);
  return (
    <>
      {course && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.shortDescription || course.description,
          url: absoluteUrl(`/courses/${course.slug}`),
          image: course.image || absoluteUrl(siteConfig.ogImage),
          provider: {
            "@type": "EducationalOrganization",
            name: siteConfig.fullName,
            sameAs: siteConfig.siteUrl,
          },
          offers: course.status === "coming_soon" ? undefined : {
            "@type": "Offer",
            price: course.price,
            priceCurrency: "EGP",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/courses/${course.slug}`),
          },
        }} />
      )}
      <CourseDetailsClient slug={slug} />
    </>
  );
}
