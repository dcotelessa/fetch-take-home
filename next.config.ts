import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'frontend-take-home.fetch.com',
        port: '',
        pathname: '/dog-images/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
