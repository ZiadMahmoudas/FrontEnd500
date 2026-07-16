import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/courses/", "/about", "/contact", "/privacy", "/terms", "/refund-policy"],
        disallow: [
          "/admin",
          "/dashboard",
          "/login",
          "/register",
          "/checkout",
          "/payment-proof",
          "/lessons",
          "/qr",
          "/api",
          "/system-status",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
