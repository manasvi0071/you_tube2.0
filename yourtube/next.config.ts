import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  images: {
    domains: ["t3.gstatic.com"], // ✅ added to fix 404 image issue
  },
};

export default nextConfig;
