import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/admin/",
    "/dashboard/",
    "/login",
    "/register",
    "/checkout/",
    "/payment-proof",
    "/lessons/",
    "/qr/",
    "/system-status",
    "/api/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image/", "/brand/"],
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/", "/_next/image/", "/brand/"],
        disallow,
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
