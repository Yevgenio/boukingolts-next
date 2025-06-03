/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'boukingolts.art', // OR domain name if you have one
          pathname: '/api/uploads/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000',
          pathname: '/api/uploads/**',
        },
      ],
    },
  };

export default nextConfig;
