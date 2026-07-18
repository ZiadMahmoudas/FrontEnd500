import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["/admin/", "/dashboard/", "/login", "/register", "/checkout/", "/payment-proof", "/lessons/", "/qr/", "/system-status", "/api/"];
  const disallow = [...privatePaths, ...privatePaths.map(path => `/en${path}`)];
  return { rules: [{ userAgent: "*", allow: ["/", "/en", "/_next/static/", "/_next/image/", "/brand/"], disallow }, { userAgent: "Googlebot", allow: ["/", "/en", "/_next/static/", "/_next/image/", "/brand/"], disallow }], sitemap: `${siteConfig.siteUrl}/sitemap.xml`, host: siteConfig.siteUrl };
}
