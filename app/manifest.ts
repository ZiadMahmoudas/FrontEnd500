import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Elmohager Platform | منصة المهاجر", short_name: "Elmohager", description: "Bilingual computer science and programming learning platform for secondary school students.", start_url: "/", display: "standalone", background_color: "#06162f", theme_color: "#06162f", lang: "ar", dir: "auto", icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }] };
}
