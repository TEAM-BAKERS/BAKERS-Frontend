import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 웹팩 설정: 브라우저에서 fs 모듈을 찾을 때 무시하도록 설정
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
