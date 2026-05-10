import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
