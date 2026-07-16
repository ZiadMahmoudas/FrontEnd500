/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images may come from the ASP.NET API or external course thumbnails.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
};

export default nextConfig;
