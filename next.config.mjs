// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       unoptimized: true,
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'boukingolts.art', // OR domain name if you have one
//           pathname: '/api/uploads/**',
//         },
//         {
//           protocol: 'http',
//           hostname: 'localhost',
//           port: '5000',
//           pathname: '/api/uploads/**',
//         },
//       ],
//     },
//   };

// export default nextConfig;


import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "boukingolts.art", // OR domain name if you have one
        pathname: "/api/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/api/uploads/**",
      },
    ],
  },

  // 👇 add this section
  experimental: {
    tsconfigPaths: true,
  },
  webpack: (config) => {
    // Map "@" to "src" folder for both dev & prod builds
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");
    return config;
  },
};

export default nextConfig;
