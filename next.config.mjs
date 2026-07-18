/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true, remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "api.qrserver.com" },
    { protocol: "https", hostname: "lmslearning.runasp.net" }
  ] },
  experimental: { cpus: 2 }
};
export default nextConfig;
