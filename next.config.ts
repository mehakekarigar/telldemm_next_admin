import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['telldemm-bucket.s3.ap-south-1.amazonaws.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
