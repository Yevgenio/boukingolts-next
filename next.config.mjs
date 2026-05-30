/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.source-code.click",
        pathname: "/gallery/**",
      },
      {
        protocol: "http",
        hostname: "10.0.0.105",
        port: "9000",
        pathname: "/gallery/**",
      },
    ],
  },
};

export default nextConfig;
