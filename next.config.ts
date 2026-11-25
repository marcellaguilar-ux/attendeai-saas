import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sdr/:path+",
        destination: "https://sdr.attendeai.ia.br/sdr/:path+",
      },
      {
        source: "/pingodoce",
        destination: "https://web-pink-eta-99.vercel.app/pingodoce",
      },
      {
        source: "/pingodoce/:path+",
        destination: "https://web-pink-eta-99.vercel.app/pingodoce/:path+",
      },
    ];
  },
};

export default nextConfig;
