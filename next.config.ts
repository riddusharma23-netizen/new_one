import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Prevent Next from selecting a parent lockfile outside this project.
    root: process.cwd(),
  },
};

export default nextConfig;
