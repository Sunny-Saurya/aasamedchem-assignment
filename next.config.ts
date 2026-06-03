import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/seller",
        destination: "/buyer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
