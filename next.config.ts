import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/sdr/:path+",
        destination: "https://sdr.attendeai.ia.br/sdr/:path+",
      },
    ];
  },
};

export default nextConfig;
