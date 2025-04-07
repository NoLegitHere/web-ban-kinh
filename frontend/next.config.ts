import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ]
  },
  // Disable caching for API requests
  experimental: {
    // @ts-ignore - NextJS types are sometimes behind the actual implementation
    workerThreads: false,
    cpus: 1
  },
  reactStrictMode: true
};

export default nextConfig;
