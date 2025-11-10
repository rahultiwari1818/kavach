import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //  eslint: {
  //     ignoreDuringBuilds: true,
  //   },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com", // in case your URLs use http
      },
    ],
  },
};

export default nextConfig;
