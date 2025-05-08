import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'boukingolts.art', // OR domain name if you have one
        port: '5000',                   // Backend port if not 80
        pathname: '/api/uploads/**',
      },
    ],
  },
};

export default nextConfig;
