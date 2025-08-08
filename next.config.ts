import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ethiopianlogos.com',
        port: '',
        pathname: '/logos/**',
      },
    ],
  },
};

export default nextConfig;
