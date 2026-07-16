import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "منصة المهاجر | الثواني الأخيرة",
    short_name: "المهاجر",
    description: "شرح ومراجعة الحاسب الآلي والبرمجة للثانوية العامة مع الأستاذ محمود المهاجر.",
    start_url: "/",
    display: "standalone",
    background_color: "#06162f",
    theme_color: "#06162f",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
