import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Disabled: this project lives under a OneDrive-synced folder, and
    // OneDrive's background file sync grabs locks on Turbopack's on-disk
    // dev cache mid-write, corrupting it ("Persisting failed: Another
    // write batch or compaction is already active"). In-memory-only
    // caching is immune to that, at the cost of slower cold starts.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
};

export default nextConfig;
